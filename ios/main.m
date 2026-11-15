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

- (void)viewDidLoad {
    [super viewDidLoad];
    UIColor *obsidian = [UIColor colorWithRed:3.0/255.0 green:3.0/255.0 blue:5.0/255.0 alpha:1.0];
    self.view.backgroundColor = obsidian;

    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
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
        [self.webView loadRequest:[NSURLRequest requestWithURL:cloudUrl]];
    }
}

- (WKWebView *)webView:(WKWebView *)webView
createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration
   forNavigationAction:(WKNavigationAction *)navigationAction
        windowFeatures:(WKWindowFeatures *)windowFeatures {
    NSURL *url = navigationAction.request.URL;
    if (url && ([url.scheme isEqualToString:@"http"] || [url.scheme isEqualToString:@"https"])) {
        SFSafariViewController *sf = [[SFSafariViewController alloc] initWithURL:url];
        sf.preferredBarTintColor = [UIColor colorWithRed:6.0/255.0 green:9.0/255.0 blue:19.0/255.0 alpha:1.0];
        sf.preferredControlTintColor = [UIColor colorWithRed:56.0/255.0 green:189.0/255.0 blue:248.0/255.0 alpha:1.0];
        [self presentViewController:sf animated:YES completion:nil];
    }
    return nil;
}

@end

@interface AetherAppDelegate : UIResponder <UIApplicationDelegate>
@property (nonatomic, strong) UIWindow *window;
@end

@implementation AetherAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor colorWithRed:3.0/255.0 green:3.0/255.0 blue:5.0/255.0 alpha:1.0];
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
