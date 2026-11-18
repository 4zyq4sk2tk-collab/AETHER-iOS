#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import <SafariServices/SafariServices.h>

static NSString * const kAetherNativeStateKey = @"aether_native_state_v13";

@class AetherViewController;

@interface AetherScriptBridge : NSObject <WKScriptMessageHandler>
@property (nonatomic, weak) AetherViewController *controller;
- (instancetype)initWithController:(AetherViewController *)controller;
@end

@interface AetherViewController : UIViewController <WKNavigationDelegate, WKUIDelegate>
@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, strong) WKUserContentController *userContentController;
- (void)handleScriptMessage:(WKScriptMessage *)message;
- (void)refreshBootUserScript;
@end

@implementation AetherScriptBridge
- (instancetype)initWithController:(AetherViewController *)controller {
    self = [super init];
    if (self) {
        _controller = controller;
    }
    return self;
}
- (void)userContentController:(WKUserContentController *)userContentController
      didReceiveScriptMessage:(WKScriptMessage *)message {
    [self.controller handleScriptMessage:message];
}
@end

@implementation AetherViewController

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (UIStatusBarStyle)preferredStatusBarStyle {
    return UIStatusBarStyleLightContent;
}

- (void)refreshBootUserScript {
    if (!self.userContentController) return;
    NSString *savedRaw = [[NSUserDefaults standardUserDefaults] stringForKey:kAetherNativeStateKey];
    NSString *encodedSaved = @"null";
    if (savedRaw && savedRaw.length > 0) {
        NSData *arrData = [NSJSONSerialization dataWithJSONObject:@[savedRaw] options:0 error:nil];
        if (arrData) {
            NSString *arrJson = [[NSString alloc] initWithData:arrData encoding:NSUTF8StringEncoding];
            encodedSaved = [NSString stringWithFormat:@"(%@)[0]", arrJson];
        }
    }

    NSString *bootJs = [NSString stringWithFormat:
        @"window.__AETHER_NATIVE_IOS_APP__ = true;"
         "window.__AETHER_DEVICE_LABEL__ = 'iPhone Uygulaması';"
         "window.__AETHER_NATIVE_SAVED_STATE__ = %@;",
        encodedSaved];

    [self.userContentController removeAllUserScripts];
    WKUserScript *bootScript = [[WKUserScript alloc] initWithSource:bootJs
                                                      injectionTime:WKUserScriptInjectionTimeAtDocumentStart
                                                   forMainFrameOnly:YES];
    [self.userContentController addUserScript:bootScript];
}

- (void)handleAppDidBecomeActive:(NSNotification *)note {
    if (!self.webView) return;
    [self.webView evaluateJavaScript:@"window.dispatchEvent(new Event('aetherNativeForeground'));"
                   completionHandler:nil];
}

- (void)openExternalSafariSheet:(NSURL *)url {
    if (!url) return;
    NSString *scheme = [url.scheme lowercaseString];
    if ([scheme isEqualToString:@"http"] || [scheme isEqualToString:@"https"]) {
        SFSafariViewController *sf = [[SFSafariViewController alloc] initWithURL:url];
        sf.preferredBarTintColor = [UIColor colorWithRed:15.0/255.0 green:23.0/255.0 blue:42.0/255.0 alpha:1.0];
        sf.preferredControlTintColor = [UIColor colorWithRed:56.0/255.0 green:189.0/255.0 blue:248.0/255.0 alpha:1.0];
        [self presentViewController:sf animated:YES completion:nil];
    }
}

- (void)handleScriptMessage:(WKScriptMessage *)message {
    if (![message.name isEqualToString:@"aetherBridge"]) return;
    if (![message.body isKindOfClass:[NSDictionary class]]) return;

    NSDictionary *body = (NSDictionary *)message.body;
    NSString *action = body[@"action"];
    if (![action isKindOfClass:[NSString class]]) return;

    if ([action isEqualToString:@"saveState"]) {
        NSString *payload = body[@"payload"];
        if ([payload isKindOfClass:[NSString class]] && payload.length > 0) {
            [[NSUserDefaults standardUserDefaults] setObject:payload forKey:kAetherNativeStateKey];
            [[NSUserDefaults standardUserDefaults] synchronize];
            [self refreshBootUserScript];
        }
        return;
    }

    if ([action isEqualToString:@"httpFetch"]) {
        NSString *reqId = [body[@"reqId"] isKindOfClass:[NSString class]] ? body[@"reqId"] : @"";
        NSString *urlStr = [body[@"url"] isKindOfClass:[NSString class]] ? body[@"url"] : @"";
        NSString *method = [body[@"method"] isKindOfClass:[NSString class]] ? body[@"method"] : @"GET";
        NSString *reqBody = [body[@"body"] isKindOfClass:[NSString class]] ? body[@"body"] : nil;
        NSDictionary *headers = [body[@"headers"] isKindOfClass:[NSDictionary class]] ? body[@"headers"] : nil;

        NSURL *url = [NSURL URLWithString:urlStr];
        if (!url || reqId.length == 0) return;

        NSMutableURLRequest *req = [NSMutableURLRequest requestWithURL:url
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                       timeoutInterval:12.0];
        req.HTTPMethod = method;
        [req setValue:@"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" forHTTPHeaderField:@"User-Agent"];
        if (headers) {
            for (id k in headers) {
                id v = headers[k];
                if ([k isKindOfClass:[NSString class]] && [v isKindOfClass:[NSString class]]) {
                    [req setValue:v forHTTPHeaderField:k];
                }
            }
        }
        if (reqBody && reqBody.length > 0) {
            req.HTTPBody = [reqBody dataUsingEncoding:NSUTF8StringEncoding];
        }

        __weak typeof(self) weakSelf = self;
        NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:req
                                                                     completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            NSInteger statusCode = 0;
            if ([response isKindOfClass:[NSHTTPURLResponse class]]) {
                statusCode = ((NSHTTPURLResponse *)response).statusCode;
            }
            NSString *utf8Str = data ? [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding] : @"";
            BOOL isRawText = (utf8Str != nil);
            NSString *payloadOut = isRawText ? utf8Str : (data ? [data base64EncodedStringWithOptions:0] : @"");
            NSString *errStr = error ? (error.localizedDescription ?: @"err") : @"";

            NSArray *args = @[reqId, @(statusCode), payloadOut, errStr, @(isRawText)];
            NSData *jsonArgsData = [NSJSONSerialization dataWithJSONObject:args options:0 error:nil];
            NSString *jsonArgs = jsonArgsData ? [[NSString alloc] initWithData:jsonArgsData encoding:NSUTF8StringEncoding] : @"[]";

            dispatch_async(dispatch_get_main_queue(), ^{
                __strong typeof(weakSelf) strongSelf = weakSelf;
                if (!strongSelf || !strongSelf.webView) return;
                NSString *js = [NSString stringWithFormat:@"if(window.__onAetherNativeFetch){window.__onAetherNativeFetch.apply(null,%@);}", jsonArgs];
                [strongSelf.webView evaluateJavaScript:js completionHandler:nil];
            });
        }];
        [task resume];
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    UIColor *bg = [UIColor colorWithRed:15.0/255.0 green:23.0/255.0 blue:42.0/255.0 alpha:1.0];
    self.view.backgroundColor = bg;

    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    config.websiteDataStore = [WKWebsiteDataStore defaultDataStore];
    config.allowsInlineMediaPlayback = YES;
    @try {
        [config.preferences setValue:@YES forKey:@"allowFileAccessFromFileURLs"];
    } @catch (NSException *e) {}
    @try {
        [config setValue:@YES forKey:@"allowUniversalAccessFromFileURLs"];
    } @catch (NSException *e) {}

    WKUserContentController *ucc = [[WKUserContentController alloc] init];
    self.userContentController = ucc;
    [self refreshBootUserScript];
    AetherScriptBridge *bridge = [[AetherScriptBridge alloc] initWithController:self];
    [ucc addScriptMessageHandler:bridge name:@"aetherBridge"];
    config.userContentController = ucc;

    self.webView = [[WKWebView alloc] initWithFrame:self.view.bounds configuration:config];
    self.webView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    self.webView.opaque = NO;
    self.webView.backgroundColor = bg;
    self.webView.scrollView.backgroundColor = [UIColor colorWithRed:241.0/255.0 green:245.0/255.0 blue:249.0/255.0 alpha:1.0];
    self.webView.scrollView.bounces = YES;
    self.webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    self.webView.navigationDelegate = self;
    self.webView.UIDelegate = self;
    [self.view addSubview:self.webView];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleAppDidBecomeActive:)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];

    NSURL *wwwDir = [[[NSBundle mainBundle] resourceURL] URLByAppendingPathComponent:@"www" isDirectory:YES];
    NSURL *indexUrl = [wwwDir URLByAppendingPathComponent:@"index.html"];
    if ([[NSFileManager defaultManager] fileExistsAtPath:[indexUrl path]]) {
        [self.webView loadFileURL:indexUrl allowingReadAccessToURL:wwwDir];
    } else {
        NSURL *cloudUrl = [NSURL URLWithString:@"https://4zyq4sk2tk-collab.github.io/AETHER-iOS/?source=ios-native"];
        if (cloudUrl) {
            [self.webView loadRequest:[NSURLRequest requestWithURL:cloudUrl]];
        }
    }
}

- (void)webViewWebContentProcessDidTerminate:(WKWebView *)webView {
    [self refreshBootUserScript];
    [webView reload];
}

- (void)webView:(WKWebView *)webView
decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction
decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSURL *url = navigationAction.request.URL;
    if (!url) {
        decisionHandler(WKNavigationActionPolicyCancel);
        return;
    }
    NSString *scheme = [url.scheme lowercaseString];
    if ([scheme isEqualToString:@"file"] || [scheme isEqualToString:@"about"] || [scheme isEqualToString:@"data"]) {
        decisionHandler(WKNavigationActionPolicyAllow);
        return;
    }
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated &&
        ([scheme isEqualToString:@"http"] || [scheme isEqualToString:@"https"])) {
        [self openExternalSafariSheet:url];
        decisionHandler(WKNavigationActionPolicyCancel);
        return;
    }
    decisionHandler(WKNavigationActionPolicyAllow);
}

- (WKWebView *)webView:(WKWebView *)webView
createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration
   forNavigationAction:(WKNavigationAction *)navigationAction
        windowFeatures:(WKWindowFeatures *)windowFeatures {
    [self openExternalSafariSheet:navigationAction.request.URL];
    return nil;
}

@end

@interface AetherAppDelegate : UIResponder <UIApplicationDelegate>
@property (nonatomic, strong) UIWindow *window;
@end

@implementation AetherAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor colorWithRed:15.0/255.0 green:23.0/255.0 blue:42.0/255.0 alpha:1.0];
    self.window.rootViewController = [[AetherViewController alloc] init];
    [self.window makeKeyAndVisible];
    return YES;
}

@end

int main(int argc, char * argv[]) {
    @autoreleasepool {
        return UIApplicationMain(argc, argv, nil, NSStringFromClass([AetherAppDelegate class]));
    }
}
