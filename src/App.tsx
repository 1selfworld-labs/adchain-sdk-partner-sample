import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, Text } from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';

import AdchainSdk from './services/AdchainSdk';

// SDK 환경 설정
const SDK_CONFIG = {
  android: {
    APP_KEY: '123456783',
    APP_SECRET: 'abcdefghigjk',
  },
  ios: {
    APP_KEY: '123456784',
    APP_SECRET: 'abcdefghigjk',
  },
};

function App(): React.JSX.Element {
  const [sdkInitialized, setSdkInitialized] = useState(false);
  useEffect(() => {
    const initTimeout = setTimeout(() => {
      initializeSDK();
    }, 500);

    return () => clearTimeout(initTimeout);
  }, []);


  const initializeSDK = async () => {
    try {
      // 플랫폼별 SDK 설정
      const sdkConfig = Platform.select({
        android: {
          appKey: SDK_CONFIG.android.APP_KEY,
          appSecret: SDK_CONFIG.android.APP_SECRET,
          environment: 'PRODUCTION' as const,
        },
        ios: {
          appKey: SDK_CONFIG.ios.APP_KEY,
          appSecret: SDK_CONFIG.ios.APP_SECRET,
          environment: 'PRODUCTION' as const,
        },
        default: {
          appKey: 'test-app',
          appSecret: 'test-secret',
          environment: 'DEVELOPMENT' as const,
        },
      });

      // SDK 초기화
      await AdchainSdk.initialize(sdkConfig);
      console.log(`AdchainSDK initialized for ${Platform.OS}`);

      // SDK 초기화 완료를 위해 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSdkInitialized(true);
    } catch (error) {
      console.error('AdchainSDK initialization error:', error);
      setSdkInitialized(true);
    }
  };

  if (!sdkInitialized) {
    return (
      <SafeAreaProvider>
      <SafeAreaView>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>SDK 초기화 중...</Text>
      </SafeAreaView>
    </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
