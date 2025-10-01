import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {getCurrentWebViewUrl} from './webview.config';

interface WebViewComponentProps {
  initialUrl?: string;
}

interface WebViewDimensions {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
}

const WebViewComponent = ({
  initialUrl = getCurrentWebViewUrl(),
}: WebViewComponentProps) => {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [dimensions, setDimensions] = useState<WebViewDimensions | null>(null);
  const webViewRef = useRef<WebView>(null);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
    // 페이지 로드 완료 시 크기 측정
    measureWebViewSize();
  };

  const handleNavigationStateChange = (navState: any) => {
    setCurrentUrl(navState.url);
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  // WebView 크기 측정 함수
  const measureWebViewSize = () => {
    const script = `
      (function() {
        const dimensions = {
          width: window.innerWidth,
          height: window.innerHeight,
          contentWidth: document.documentElement.scrollWidth,
          contentHeight: document.documentElement.scrollHeight,
          scrollX: window.scrollX || window.pageXOffset,
          scrollY: window.scrollY || window.pageYOffset
        };
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'dimensions',
          data: dimensions
        }));
      })();
      true;
    `;
    webViewRef.current?.injectJavaScript(script);
  };

  // WebView에서 React Native로 메시지 수신
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('📩 WebView Message:', message);

      switch (message.type) {
        case 'dimensions':
          setDimensions(message.data);
          break;
        case 'scroll':
          console.log('📜 Scroll Position:', message.data);
          break;
        case 'click':
          console.log('👆 Element Clicked:', message.data);
          break;
        default:
          console.log('📨 Custom Message:', message);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  // React Native에서 WebView로 JavaScript 실행
  // const executeJavaScript = (script: string) => {
  //   webViewRef.current?.injectJavaScript(script);
  // };

  // // 예제: 특정 위치로 스크롤
  // const scrollToPosition = (x: number, y: number) => {
  //   const script = `
  //     window.scrollTo(${x}, ${y});
  //     setTimeout(() => {
  //       window.ReactNativeWebView.postMessage(JSON.stringify({
  //         type: 'scroll',
  //         data: { x: window.scrollX, y: window.scrollY }
  //       }));
  //     }, 100);
  //     true;
  //   `;
  //   executeJavaScript(script);
  // };

  // // 예제: 웹페이지의 특정 데이터 가져오기
  // const getPageData = () => {
  //   const script = `
  //     (function() {
  //       const data = {
  //         title: document.title,
  //         url: window.location.href,
  //         links: Array.from(document.querySelectorAll('a')).length,
  //         images: Array.from(document.querySelectorAll('img')).length,
  //         bodyText: document.body.innerText.substring(0, 100)
  //       };
  //       window.ReactNativeWebView.postMessage(JSON.stringify({
  //         type: 'pageData',
  //         data: data
  //       }));
  //     })();
  //     true;
  //   `;
  //   executeJavaScript(script);
  // };

  // const handleGoBack = () => {
  //   if (webViewRef.current && canGoBack) {
  //     webViewRef.current.goBack();
  //   }
  // };

  // const handleGoForward = () => {
  //   if (webViewRef.current && canGoForward) {
  //     webViewRef.current.goForward();
  //   }
  // };

  // const handleReload = () => {
  //   if (webViewRef.current) {
  //     webViewRef.current.reload();
  //   }
  // };

  // const handleNavigate = () => {
  //   if (url.trim()) {
  //     let formattedUrl = url.trim();
  //     if (
  //       !formattedUrl.startsWith('http://') &&
  //       !formattedUrl.startsWith('https://')
  //     ) {
  //       formattedUrl = 'https://' + formattedUrl;
  //     }
  //     setCurrentUrl(formattedUrl);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{uri: currentUrl}}
        style={styles.webView}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
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
