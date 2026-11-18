#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import <SafariServices/SafariServices.h>
#import <UserNotifications/UserNotifications.h>

static NSString * const kAetherNativeStateKey = @"aether_native_state_v13";
static NSString * const kAetherNativeThemeKey = @"aether_native_theme_v14";

@class AetherViewController;

@interface AetherScriptBridge : NSObject <WKScriptMessageHandler>
@property (nonatomic, weak) AetherViewController *controller;
- (instancetype)initWithController:(AetherViewController *)controller;
@end

@interface AetherViewController : UIViewController <WKNavigationDelegate, WKUIDelegate, UIScrollViewDelegate, UNUserNotificationCenterDelegate>
@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, strong) WKUserContentController *userContentController;
@property (nonatomic, assign) BOOL isDaylightTheme;
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
    return self.isDaylightTheme ? UIStatusBarStyleDarkContent : UIStatusBarStyleLightContent;
}

- (UIColor *)currentCanvasColor {
    if (self.isDaylightTheme) {
        return [UIColor colorWithRed:238.0/255.0 green:242.0/255.0 blue:247.0/255.0 alpha:1.0];
    }
    return [UIColor colorWithRed:6.0/255.0 green:10.0/255.0 blue:18.0/255.0 alpha:1.0];
}

- (void)applyNativeTheme:(NSString *)themeStr {
    BOOL daylight = [themeStr isEqualToString:@"daylight"];
    self.isDaylightTheme = daylight;
    [[NSUserDefaults standardUserDefaults] setObject:(daylight ? @"daylight" : @"obsidian") forKey:kAetherNativeThemeKey];
    UIColor *bg = [self currentCanvasColor];
    self.view.backgroundColor = bg;
    if (self.webView) {
        self.webView.backgroundColor = bg;
        self.webView.scrollView.backgroundColor = bg;
    }
    [self setNeedsStatusBarAppearanceUpdate];
}

- (void)triggerHaptic:(NSString *)style {
    if ([style isEqualToString:@"selection"]) {
        UISelectionFeedbackGenerator *gen = [[UISelectionFeedbackGenerator alloc] init];
        [gen prepare];
        [gen selectionChanged];
    } else if ([style isEqualToString:@"success"]) {
        UINotificationFeedbackGenerator *gen = [[UINotificationFeedbackGenerator alloc] init];
        [gen prepare];
        [gen notificationOccurred:UINotificationFeedbackTypeSuccess];
    } else if ([style isEqualToString:@"warning"]) {
        UINotificationFeedbackGenerator *gen = [[UINotificationFeedbackGenerator alloc] init];
        [gen prepare];
        [gen notificationOccurred:UINotificationFeedbackTypeWarning];
    } else if ([style isEqualToString:@"error"]) {
        UINotificationFeedbackGenerator *gen = [[UINotificationFeedbackGenerator alloc] init];
        [gen prepare];
        [gen notificationOccurred:UINotificationFeedbackTypeError];
    } else {
        UIImpactFeedbackStyle impactStyle = UIImpactFeedbackStyleLight;
        if ([style isEqualToString:@"medium"]) impactStyle = UIImpactFeedbackStyleMedium;
        else if ([style isEqualToString:@"heavy"]) impactStyle = UIImpactFeedbackStyleHeavy;
        else if ([style isEqualToString:@"rigid"]) impactStyle = UIImpactFeedbackStyleRigid;
        else if ([style isEqualToString:@"soft"]) impactStyle = UIImpactFeedbackStyleSoft;
        UIImpactFeedbackGenerator *gen = [[UIImpactFeedbackGenerator alloc] initWithStyle:impactStyle];
        [gen prepare];
        [gen impactOccurred];
    }
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
        sf.preferredBarTintColor = [UIColor colorWithRed:6.0/255.0 green:10.0/255.0 blue:18.0/255.0 alpha:1.0];
        sf.preferredControlTintColor = [UIColor colorWithRed:245.0/255.0 green:158.0/255.0 blue:11.0/255.0 alpha:1.0];
        [self presentViewController:sf animated:YES completion:nil];
    }
}

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView {
    return nil;
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {
    completionHandler(UNNotificationPresentationOptionBanner | UNNotificationPresentationOptionList | UNNotificationPresentationOptionSound);
}

- (void)handleScriptMessage:(WKScriptMessage *)message {
    if (![message.name isEqualToString:@"aetherBridge"]) return;
    if (![message.body isKindOfClass:[NSDictionary class]]) return;

    NSDictionary *body = (NSDictionary *)message.body;
    NSString *action = body[@"action"];
    if (![action isKindOfClass:[NSString class]]) return;

    if ([action isEqualToString:@"haptic"]) {
        NSString *style = [body[@"style"] isKindOfClass:[NSString class]] ? body[@"style"] : @"light";
        [self triggerHaptic:style];
        return;
    }

    if ([action isEqualToString:@"setTheme"]) {
        NSString *theme = [body[@"theme"] isKindOfClass:[NSString class]] ? body[@"theme"] : @"obsidian";
        [self applyNativeTheme:theme];
        return;
    }

    if ([action isEqualToString:@"requestNotifications"]) {
        UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
        center.delegate = self;
        [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
                              completionHandler:^(BOOL granted, NSError * _Nullable error) {}];
        return;
    }

    if ([action isEqualToString:@"scheduleNotification"]) {
        NSString *nid = [body[@"id"] isKindOfClass:[NSString class]] ? body[@"id"] : @"aether_alert";
        NSString *title = [body[@"title"] isKindOfClass:[NSString class]] ? body[@"title"] : @"AETHER";
        NSString *msg = [body[@"body"] isKindOfClass:[NSString class]] ? body[@"body"] : @"";
        double delaySec = [body[@"delaySec"] respondsToSelector:@selector(doubleValue)] ? [body[@"delaySec"] doubleValue] : 1.0;
        if (msg.length == 0) return;

        UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
        content.title = title;
        content.body = msg;
        content.sound = [UNNotificationSound defaultSound];

        UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:MAX(1.0, delaySec) repeats:NO];
        UNNotificationRequest *req = [UNNotificationRequest requestWithIdentifier:nid content:content trigger:trigger];
        [[UNUserNotificationCenter currentNotificationCenter] addNotificationRequest:req withCompletionHandler:nil];
        return;
    }

    if ([action isEqualToString:@"share"]) {
        NSString *text = [body[@"text"] isKindOfClass:[NSString class]] ? body[@"text"] : @"";
        NSString *urlStr = [body[@"url"] isKindOfClass:[NSString class]] ? body[@"url"] : @"";
        NSMutableArray *items = [NSMutableArray array];
        if (text.length > 0) [items addObject:text];
        if (urlStr.length > 0) {
            NSURL *u = [NSURL URLWithString:urlStr];
            if (u) [items addObject:u];
        }
        if (items.count == 0) return;
        UIActivityViewController *avc = [[UIActivityViewController alloc] initWithActivityItems:items applicationActivities:nil];
        if (avc.popoverPresentationController) {
            avc.popoverPresentationController.sourceView = self.view;
            avc.popoverPresentationController.sourceRect = CGRectMake(CGRectGetMidX(self.view.bounds), CGRectGetMaxY(self.view.bounds) - 60.0, 1.0, 1.0);
        }
        [self presentViewController:avc animated:YES completion:nil];
        return;
    }

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
        [req setValue:@"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15" forHTTPHeaderField:@"User-Agent"];
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
    NSString *savedTheme = [[NSUserDefaults standardUserDefaults] stringForKey:kAetherNativeThemeKey];
    self.isDaylightTheme = [savedTheme isEqualToString:@"daylight"];
    UIColor *bg = [self currentCanvasColor];
    self.view.backgroundColor = bg;

    [UNUserNotificationCenter currentNotificationCenter].delegate = self;

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
    self.webView.allowsLinkPreview = NO;
    self.webView.allowsBackForwardNavigationGestures = NO;
    self.webView.scrollView.backgroundColor = bg;
    self.webView.scrollView.bounces = NO;
    self.webView.scrollView.alwaysBounceVertical = NO;
    self.webView.scrollView.alwaysBounceHorizontal = NO;
    self.webView.scrollView.showsVerticalScrollIndicator = NO;
    self.webView.scrollView.showsHorizontalScrollIndicator = NO;
    self.webView.scrollView.minimumZoomScale = 1.0;
    self.webView.scrollView.maximumZoomScale = 1.0;
    self.webView.scrollView.delegate = self;
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
    self.window.backgroundColor = [UIColor colorWithRed:6.0/255.0 green:10.0/255.0 blue:18.0/255.0 alpha:1.0];
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
