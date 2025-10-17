import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {getCurrentWebViewUrl} from './webview.config';

interface WebViewComponentProps {
  initialUrl?: string;
}

// Removed unused WebViewDimensions interface

const WebViewComponent = ({
  initialUrl = getCurrentWebViewUrl(),
}: WebViewComponentProps) => {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (navState: any) => {
    setCurrentUrl(navState.url);
  };

  // WebView에서 React Native로 메시지 수신
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      switch (message.type) {
        case 'scroll':
          console.log('📜 Scroll Position:', message.data);
          break;
        case 'click':
          console.log('👆 Element Clicked:', message.data);
          break;
        case 'trackEvent': {
          const eventName = message?.data?.eventName;
          console.log('📩 Track Event:', eventName);

          if (eventName === 'membership_point_clicked') {
            Alert.alert(
              '웹뷰 테스트',
              '안녕하세요',
              [{text: '확인'}],
              {cancelable: true},
            );
          }
          break;
        }
        case 'adchain_event': {
          const {event: eventName, payload} = message;
          if (eventName === 'membership_point_clicked' && payload?.modalType === 'SIMPLE_INFO') {
            Alert.alert(
              '포인트 안내',
              '멤버십 포인트 정보를 확인하세요.',
              [{text: '확인'}],
              {cancelable: true},
            );

            // 웹으로 postmessage 보내기 (웹의 window.addEventListener('message')에서 받을 수 있도록)
            const script = `
              window.postMessage('success_webview_message', '*');
              true;
            `;
            webViewRef.current?.injectJavaScript(script);
          }
          break;
        }
        default:
          console.log('📨 Custom Message:', message);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
      Alert.alert(
        '웹뷰 메세지',
        '오류가 발생했습니다. 다시 시도해주세요.',
        [{text: '확인'}],
        {cancelable: true},
      );
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{uri: currentUrl}}
        style={styles.webView}
        onLoadStart={() => {}}
        onLoadEnd={() => {}}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        // 스크롤 관련 설정
        scrollEnabled={true}
        bounces={true}
        // JavaScript를 페이지 로드 전에 주입
        injectedJavaScriptBeforeContentLoaded={`
          // adChain 브리지 정의: SDK 이벤트를 RN으로 전달
          (function() {
            try {
              var safePost = function(payload) {
                try {
                  window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(payload));
                } catch (e) { /* noop */ }
              };
              
              // iOS WKWebView 호환 레이어: window.webkit.messageHandlers.postMessage -> RN postMessage 매핑
              try {
                if (!window.webkit) { window.webkit = {}; }
                if (!window.webkit.messageHandlers) { window.webkit.messageHandlers = {}; }
                if (typeof window.webkit.messageHandlers.postMessage !== 'function') {
                  window.webkit.messageHandlers.postMessage = function(message) {
                    try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(message)); } catch (e) { /* noop */ }
                  };
                }
              } catch (_) { /* noop */ }

              if (!window.adChain) { window.adChain = {}; }
              window.adChain.callTrackEvent = function(name, payload) {
                // 웹 코드가 기대하는 표준 타입 'trackEvent' 메시지로도 발송
                safePost({ type: 'trackEvent', data: { eventName: name, payload: payload || {} } });
                // 하위 호환: 기존 adchain_event 타입도 함께 발송
                safePost({ type: 'adchain_event', event: name, payload: payload || {} });
              };
            } catch (e) { /* noop */ }
          })();

          // 스크롤 이벤트 리스너 추가
          window.addEventListener('scroll', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'scroll',
              data: {
                x: window.scrollX || window.pageXOffset,
                y: window.scrollY || window.pageYOffset
              }
            }));
          });
          true;
        `}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  urlBar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  goButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  goButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  navigationBar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentUrlContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currentUrl: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
  },
  webView: {
    flex: 1,
  },
  debugBar: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#e8f4f8',
    borderBottomWidth: 1,
    borderBottomColor: '#b3d9e8',
    gap: 4,
  },
  debugButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  debugInfo: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#b3d9e8',
    maxHeight: 120,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default WebViewComponent;
