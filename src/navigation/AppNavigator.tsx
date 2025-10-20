import React, { useRef, useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ListScreen from '../screens/ListScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import MyPageScreen from '../screens/MyPageScreen';
import SdkExampleScreen from '../screens/SdkExampleScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdchainOfferwallView from '../components/offerwall';

export type TabParamList = {
  Home: undefined;
  List: undefined;
  Favorite: undefined;
  Benefit: undefined;
  MyPage: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  SdkExample: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const SettingsButton = () => (
  <TouchableOpacity
    onPress={() => Alert.alert('설정', '설정 메뉴를 선택했습니다.')}
    style={styles.headerButton}>
    <Text style={styles.headerIcon}>⚙️</Text>
  </TouchableOpacity>
);

const HomeIcon = ({color}: {color: string}) => (
  <Text style={[styles.tabIcon, {color}]}>🏠</Text>
);

const ListIcon = ({color}: {color: string}) => (
  <Text style={[styles.tabIcon, {color}]}>📋</Text>
);

const FavoriteIcon = ({color}: {color: string}) => (
  <Text style={[styles.tabIcon, {color}]}>❤️</Text>
);

const BenefitIcon = ({color}: {color: string}) => (
  <Text style={[styles.tabIcon, {color}]}>🎁</Text>
);

const MyPageIcon = ({color}: {color: string}) => (
  <Text style={[styles.tabIcon, {color}]}>👤</Text>
);

const TabNavigator = () => {
  const [benefitKey, setBenefitKey] = useState(0);
  const offerwallViewRef = useRef(null);
  // const viewRef = useRef<any>(null);

  // // SDK 설정에서 기본값 가져오기
  // const defaultAppKey = Platform.select({
  //   android: '123456781',
  //   ios: '123456781',
  //   default: '123456781',
  // });

  // const defaultBaseUrl = 'https://adchain-offerwall-ddocdoc.1self.world/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=Android&app_key=100000001&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.33';
  // const defaultPlatform = Platform.OS;

  // // Status bar 높이 계산 (iOS는 기기별로 다름)
  // const getStatusBarHeight = () => {
  //   if (Platform.OS === 'ios') {
  //     const { height, width } = Dimensions.get('window');
  //     // iPhone X 이상 (notch가 있는 기기)
  //     if (height >= 812 || width >= 812) {
  //       return 44; // iPhone X 이상
  //     } else {
  //       return 20; // iPhone 8 이하
  //     }
  //   } else {
  //     return StatusBar.currentHeight || 0;
  //   }
  // };
  // const statusBarHeight = getStatusBarHeight();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="List"
        component={ListScreen}
        options={{
          title: '목록',
          tabBarIcon: ListIcon,
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          title: '즐겨찾기',
          tabBarIcon: FavoriteIcon,
        }}
      />
      <Tab.Screen
        name="Benefit"
        options={{
          title: '혜택',
          headerShown: false,
          tabBarIcon: BenefitIcon,
        }}
        listeners={{
          tabPress: (e) => {
            // 탭이 클릭될 때마다 key를 변경하여 컴포넌트 재마운트
            setBenefitKey(prev => prev + 1);
          },
        }}
      >
        {() => (
          <AdchainOfferwallView
            key={benefitKey}
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
        )}
      </Tab.Screen>
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          title: '마이페이지',
          headerRight: SettingsButton,
          tabBarIcon: MyPageIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SdkExample"
        component={SdkExampleScreen}
        options={{
          title: 'SDK Example',
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 16,
  },
  headerIcon: {
    fontSize: 24,
  },
  tabIcon: {
    fontSize: 24,
  },
});

export default AppNavigator;

