import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ListScreen from '../screens/ListScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import MyPageScreen from '../screens/MyPageScreen';
import BenefitScreen from '../screens/BenefitScreen';
import SdkExampleScreen from '../screens/SdkExampleScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


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
        component={BenefitScreen}
        options={{
          title: '혜택',
          headerShown: false,
          tabBarIcon: BenefitIcon,
        }}
       />
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

