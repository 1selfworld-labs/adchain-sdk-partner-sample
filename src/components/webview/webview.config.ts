/**
 * WebView 설정 파일
 *
 * 환경에 따라 다른 URL을 사용하고 싶다면 여기서 관리하세요.
 */

// 개발 환경 설정
export const WEBVIEW_CONFIG = {
  DEFAULT_URL: 'http://192.168.0.29:18000/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=IOS&app_key=123456781&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.35',
  PRODUCTION_URL: 'https://adchain-offerwall.1self.world?user_id=test123456&app_key=123456781&platform=ios&ifa=00000000-0000-0000-0000-000000000000&sdk_version=1.0.15&device_id=1234567890&device_model=iPhone16&device_manufacturer=Apple&session_id=1234567890&os_version=1.0.15&screen_width=1080&screen_height=1920&timestamp=1727731200',
};

  // 현재 사용할 URL 선택
  export const getCurrentWebViewUrl = () => {
    if (__DEV__) {
      return WEBVIEW_CONFIG.DEFAULT_URL;
    }
    return WEBVIEW_CONFIG.PRODUCTION_URL;
  };

  export default WEBVIEW_CONFIG;
