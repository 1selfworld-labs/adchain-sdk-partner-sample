import React, { useRef } from 'react';
import { View, StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { requireNativeComponent } from 'react-native';

// 네이티브 컴포넌트 가져오기
const NativeOfferwallView = requireNativeComponent<any>('AdchainOfferwallView');

// Props 타입 정의
interface AdchainOfferwallViewProps {
  placementId?: string;
  url?: string;
  appKey?: string;
  baseUrl?: string;
  userId?: string;
  platform?: string;
  style?: any;
}

/**
 * Adchain Offerwall을 React Native에서 사용하기 위한 컴포넌트
 * 네이티브 View를 React Native 컴포넌트로 래핑
 */
const AdchainOfferwallView: React.FC<AdchainOfferwallViewProps> = ({
  placementId,
  url,
  appKey,
  baseUrl,
  userId,
  platform,
  style,
}) => {
  const viewRef = useRef<any>(null);

  // SDK 설정에서 기본값 가져오기
  const defaultAppKey = Platform.select({
    android: '123456781',
    ios: '123456781',
    default: '123456781',
  });

  const defaultBaseUrl = 'https://adchain-offerwall-ddocdoc.1self.world/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=Android&app_key=100000001&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.33';
  const defaultPlatform = Platform.OS;

  // Status bar 높이 계산 (iOS는 기기별로 다름)
  const getStatusBarHeight = () => {
    if (Platform.OS === 'ios') {
      const { height, width } = Dimensions.get('window');
      // iPhone X 이상 (notch가 있는 기기)
      if (height >= 812 || width >= 812) {
        return 44; // iPhone X 이상
      } else {
        return 20; // iPhone 8 이하
      }
    } else {
      return StatusBar.currentHeight || 0;
    }
  };

  const statusBarHeight = getStatusBarHeight();

  // 디버깅을 위한 로그 추가
  console.log('🔥 AdchainOfferwallView: Received props:', {
    placementId,
    url,
    appKey,
    baseUrl,
    userId,
    platform,
  });

  console.log('🔥 AdchainOfferwallView: About to render NativeOfferwallView with URL:', url);
  console.log('🔥 AdchainOfferwallView: Status bar height:', statusBarHeight);

  return (
    <View style={[styles.container, style]}>
      <NativeOfferwallView
        ref={viewRef}
        placementId={placementId || ''}
        url={url}
        appKey={appKey || defaultAppKey}
        baseUrl={baseUrl || defaultBaseUrl}
        userId={userId}
        platform={platform || defaultPlatform}
        style={[styles.webViewContainer, { marginTop: statusBarHeight }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: 400, // 최소 높이 설정
    minWidth: 300,  // 최소 너비 설정
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default AdchainOfferwallView;
