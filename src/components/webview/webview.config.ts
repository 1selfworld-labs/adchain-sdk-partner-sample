/**
 * WebView 설정 파일
 *
 * 환경에 따라 다른 URL을 사용하고 싶다면 여기서 관리하세요.
 */

// 개발 환경 설정
export const WEBVIEW_CONFIG = {
    // 기본 URL (개발 서버)
    DEFAULT_URL: 'https://adchain-offerwall.1self.world?user_id=test123456&app_key=100000002&platform=ios&ifa=00000000-0000-0000-0000-000000000000&sdk_version=1.0.15&device_id=1234567890&device_model=iPhone16&device_manufacturer=Apple&session_id=1234567890&os_version=1.0.15&screen_width=1080&screen_height=1920&timestamp=1727731200',

    // 다른 환경 URL들
    PRODUCTION_URL: 'https://adchain-offerwall.1self.world?user_id=test123456&app_key=100000002&platform=ios&ifa=00000000-0000-0000-0000-000000000000&sdk_version=1.0.15&device_id=1234567890&device_model=iPhone16&device_manufacturer=Apple&session_id=1234567890&os_version=1.0.15&screen_width=1080&screen_height=1920&timestamp=1727731200',
    STAGING_URL: 'https://adchain-offerwall.1self.world?user_id=test123456&app_key=100000002&platform=ios&ifa=00000000-0000-0000-0000-000000000000&sdk_version=1.0.15&device_id=1234567890&device_model=iPhone16&device_manufacturer=Apple&session_id=1234567890&os_version=1.0.15&screen_width=1080&screen_height=1920&timestamp=1727731200',

    // 로컬 개발 서버 (여러 개발자가 다른 IP 사용 시)
    LOCAL_DEV: {
      LOCALHOST: 'https://adchain-offerwall.1self.world?user_id=test123456&app_key=100000002&platform=ios&ifa=00000000-0000-0000-0000-000000000000&sdk_version=1.0.15&device_id=1234567890&device_model=iPhone16&device_manufacturer=Apple&session_id=1234567890&os_version=1.0.15&screen_width=1080&screen_height=1920&timestamp=1727731200',
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

  export default WEBVIEW_CONFIG;
