import React, { useRef } from 'react';
import {View, StyleSheet, StatusBar, Platform, Alert} from 'react-native';
import { AdchainOfferwallView } from '../services/Adchain';

const WebviewScreen = () => {
  const offerwallViewRef = useRef(null);
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
      <AdchainOfferwallView
            ref={offerwallViewRef}
            placementId="tab_embedded_offerwall"
            style={{ flex: 1, width: '100%' }}
            onOfferwallOpened={() => console.log('Offerwall opened in tab')}
            onOfferwallClosed={() => console.log('Offerwall closed in tab')}
            onOfferwallError={(error) => console.error('Offerwall error:', error)}
            onRewardEarned={(amount) => console.log('Reward earned:', amount)}
            onCustomEvent={(eventType, payload) => {
              console.log('[WebView → App] Custom Event:', eventType, payload);

              // 이벤트 타입별 처리
              if (eventType === 'show_toast') {
                Alert.alert('WebView Message', payload.message || JSON.stringify(payload));
              } else if (eventType === 'navigate') {
                Alert.alert('Navigation Request', `Target: ${payload.screen || 'unknown'}`);
              } else if (eventType === 'share') {
                Alert.alert('Share Request', `Title: ${payload.title || ''}\nURL: ${payload.url || ''}`);
              } else {
                Alert.alert('Custom Event', `Type: ${eventType}\n\n${JSON.stringify(payload, null, 2)}`);
              }
            }}
            onDataRequest={(requestType, params) => {
              console.log('[WebView → App] Data Request:', requestType, params);

              // 요청 타입별 응답 데이터
              const responses: Record<string, any> = {
                'user_points': { points: 12345, currency: 'KRW' },
                'user_profile': { userId: 'test_123', nickname: 'TestPlayer', level: 42 },
                'app_version': { version: '1.0.0', buildNumber: 100 },
              };

              const response = responses[requestType] || null;
              console.log('[App → WebView] Data Response:', response);

              return response;
            }}
         />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default WebviewScreen;
