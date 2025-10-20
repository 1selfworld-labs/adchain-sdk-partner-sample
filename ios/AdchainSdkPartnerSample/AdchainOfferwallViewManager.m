#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(AdchainOfferwallViewManager, RCTViewManager)

// React Native Props
RCT_EXTERN_METHOD(setPlacementId:(UIView *)view placementId:(NSString *)placementId)
RCT_EXTERN_METHOD(setAppKey:(UIView *)view appKey:(NSString *)appKey)
RCT_EXTERN_METHOD(setBaseUrl:(UIView *)view baseUrl:(NSString *)baseUrl)
RCT_EXTERN_METHOD(setUserId:(UIView *)view userId:(NSString *)userId)
RCT_EXTERN_METHOD(setPlatform:(UIView *)view platform:(NSString *)platform)
RCT_EXTERN_METHOD(setUrl:(UIView *)view url:(NSString *)url)

// Event Handlers
RCT_EXTERN_METHOD(onOfferwallOpened:(UIView *)view)
RCT_EXTERN_METHOD(onOfferwallClosed:(UIView *)view)
RCT_EXTERN_METHOD(onOfferwallError:(UIView *)view message:(NSString *)message)
RCT_EXTERN_METHOD(onRewardEarned:(UIView *)view amount:(NSInteger)amount)

@end
