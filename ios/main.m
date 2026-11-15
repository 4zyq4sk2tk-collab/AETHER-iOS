#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import <SafariServices/SafariServices.h>

@interface AetherViewController : UIViewController <WKNavigationDelegate, WKUIDelegate>
@property (nonatomic, strong) WKWebView *webView;
@end

@implementation AetherViewController

- (UIStatusBarStyle)preferredStatusBarStyle {
    return UIStatusBarStyleLightContent;
}

- (void)openExternalSafariSheet:(NSURL *)url {
    if (!url) return;
    NSString *scheme = [url.scheme lowercaseString];
    if ([scheme isEqualToString:@"http"] || [scheme isEqualToString:@"https"]) {
        SFSafariViewController *sf = [[SFSafariViewController alloc] initWithURL:url];
        sf.preferredBarTintColor = [UIColor colorWithRed:7.0/255.0 green:8.0/255.0 blue:13.0/255.0 alpha:1.0];
        sf.preferredControlTintColor = [UIColor colorWithRed:96.0/255.0 green:165.0/255.0 blue:250.0/255.0 alpha:1.0];
        [self presentViewController:sf animated:YES completion:nil];
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    UIColor *obsidian = [UIColor colorWithRed:7.0/255.0 green:8.0/255.0 blue:13.0/255.0 alpha:1.0];
    self.view.backgroundColor = obsidian;

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
    WKUserScript *bootScript = [[WKUserScript alloc] initWithSource:@"window.__AETHER_NATIVE_IOS_APP__ = true;"
                                                      injectionTime:WKUserScriptInjectionTimeAtDocumentStart
                                                   forMainFrameOnly:NO];
    [ucc addUserScript:bootScript];
    config.userContentController = ucc;

    self.webView = [[WKWebView alloc] initWithFrame:self.view.bounds configuration:config];
    self.webView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    self.webView.opaque = NO;
    self.webView.backgroundColor = obsidian;
    self.webView.scrollView.backgroundColor = obsidian;
    self.webView.scrollView.bounces = YES;
    self.webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    self.webView.navigationDelegate = self;
    self.webView.UIDelegate = self;
    [self.view addSubview:self.webView];

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
    self.window.backgroundColor = [UIColor colorWithRed:7.0/255.0 green:8.0/255.0 blue:13.0/255.0 alpha:1.0];
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
