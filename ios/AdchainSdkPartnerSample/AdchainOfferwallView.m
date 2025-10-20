#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(AdchainOfferwallViewManager, RCTViewManager)

// React Native Props
RCT_EXTERN_METHOD(setPlacementId:(UIView *)view placementId:(NSString *)placementId)
RCT_EXTERN_METHOD(setAppKey:(UIView *)view appKey:(NSString *)appKey)
RCT_EXTERN_METHOD(setBaseUrl:(UIView *)view baseUrl:(NSString *)baseUrl)
RCT_EXTERN_METHOD(setUserId:(UIView *)view userId:(NSString *)userId)
RCT_EXTERN_METHOD(setPlatform:(UIView *)view platform:(NSString *)platform)
RCT_EXTERN_METHOD(setUrl:(UIView *)view url:(NSString *)url)

// Methods
RCT_EXTERN_METHOD(loadOfferwall:(UIView *)view url:(NSString *)url)
RCT_EXTERN_METHOD(setCallback:(UIView *)view callback:(id)callback)
RCT_EXTERN_METHOD(cleanup:(UIView *)view)

@end
