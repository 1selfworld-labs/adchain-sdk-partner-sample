/**
 * WebView 설정 파일
 *
 * 환경에 따라 다른 URL을 사용하고 싶다면 여기서 관리하세요.
 */

// 개발 환경 설정
export const WEBVIEW_CONFIG = {
    // 기본 URL (개발 서버)
    DEFAULT_URL: 'http://192.168.0.209:18000/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=IOS&app_key=123456781&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.35',

    // 다른 환경 URL들
    PRODUCTION_URL: 'https://adchain-offerwall.1self.world',
    STAGING_URL: 'https://adchain-offerwall.1self.world',
    EVENT_URL: 'https://adchain-offerwall-event.1self.world',

    // 로컬 개발 서버 (여러 개발자가 다른 IP 사용 시)
    LOCAL_DEV: {
      LOCALHOST: 'http://192.168.0.209:18000/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=Android&app_key=123456781&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.33',
      // 다른 개발자의 IP를 여기에 추가
    },
  };

  // 현재 사용할 URL 선택
  export const getCurrentWebViewUrl = () => {
    // __DEV__는 React Native에서 제공하는 개발 모드 플래그
    if (__DEV__) {
      return WEBVIEW_CONFIG.DEFAULT_URL;
    }
    return WEBVIEW_CONFIG.PRODUCTION_URL;
  };

  // Event 도메인 URL 선택 (테스트용)
  export const getEventWebViewUrl = () => {
    return WEBVIEW_CONFIG.EVENT_URL;
  };

  export default WEBVIEW_CONFIG;
