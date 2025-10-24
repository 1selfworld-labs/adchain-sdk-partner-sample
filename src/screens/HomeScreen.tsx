import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AdchainSdk from '@1selfworld/adchain-sdk-react-native';

type TabParamList = {
  Home: undefined;
  List: undefined;
  Favorite: undefined;
  Benefit: undefined;
  MyPage: undefined;
};

type RootStackParamList = {
  MainTabs: undefined;
  SdkExample: undefined;
};

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const { width } = Dimensions.get('window');
const CARD_PADDING = 20; // 좌우 padding
const CARD_GAP = 12; // 카드 사이 간격
const CARD_WIDTH = (width - (CARD_PADDING * 2) - CARD_GAP) / 2;

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 임시 사용자 정보로 빠른 로그인
  const handleQuickLogin = async () => {
    if (isLoggingIn) {return;}

    setIsLoggingIn(true);

    try {
      // SDK 초기화 (필요한 경우)
      const isInitialized = await AdchainSdk.isInitialized();
      if (!isInitialized) {
        const sdkConfig = Platform.select({
          android: {
            appKey: '100000001',
            appSecret: 'gjFs586lLuUweJRN',
            environment: 'PRODUCTION' as const,
          },
          ios: {
            appKey: '100000002',
            appSecret: '3ANgfF9Zfbm79oa6',
            environment: 'PRODUCTION' as const,
          },
          default: {
            appKey: 'test-app',
            appSecret: 'test-secret',
            environment: 'DEVELOPMENT' as const,
          },
        });

        await AdchainSdk.initialize(sdkConfig);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
      }

      // 임시 사용자 정보로 로그인
      const tempUser = {
        userId: `temp_user_${Date.now()}`,
        gender: 'MALE' as const,
        birthYear: 1990,
      };

      await AdchainSdk.login(tempUser);

      Alert.alert(
        '로그인 성공! 🎉',
        `임시 사용자로 로그인되었습니다.\nUser ID: ${tempUser.userId}`,
        [
          {
            text: 'SDK 테스트하기',
            onPress: () => navigation.navigate('SdkExample'),
          },
          {
            text: '확인',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Quick login error:', error);
      Alert.alert(
        '로그인 실패',
        `오류가 발생했습니다: ${error}`,
        [{ text: '확인' }]
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
          />
        </View>

        {/* Promotions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promotions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promotionsContainer}>

            <TouchableOpacity
              style={[styles.promotionCard, styles.promotionCardPrimary]}
              onPress={() => navigation.navigate('SdkExample')}>
              <View style={styles.promotionContent}>
                <Text style={styles.promotionEmoji}>🎯</Text>
                <Text style={styles.promotionTitle}>SDK Sample</Text>
                <Text style={styles.promotionDescription}>
                  모든 SDK 기능을{'\n'}테스트하세요
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.promotionCard, styles.promotionCardSecondary]}>
              <View style={styles.promotionContent}>
                <Text style={styles.promotionEmoji}>🎁</Text>
                <Text style={styles.promotionTitle}>Quiz & Mission</Text>
                <Text style={styles.promotionDescriptionDark}>
                  퀴즈와 미션으로{'\n'}리워드 획득
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.promotionCard, styles.promotionCardTertiary]}>
              <View style={styles.promotionContent}>
                <Text style={styles.promotionEmoji}>💰</Text>
                <Text style={styles.promotionTitle}>Offerwall</Text>
                <Text style={styles.promotionDescriptionDark}>
                  다양한 광고로{'\n'}수익 창출
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Featured Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Categories</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => navigation.navigate('SdkExample')}>
              <View style={[styles.categoryImage, styles.categoryBgGreen]}>
                <Text style={styles.categoryEmoji}>📱</Text>
              </View>
              <Text style={styles.categoryTitle}>SDK 기능</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryCard,
                isLoggingIn && styles.categoryCardDisabled,
              ]}
              onPress={handleQuickLogin}
              disabled={isLoggingIn}>
              <View style={[styles.categoryImage, styles.categoryBgOrange]}>
                <Text style={styles.categoryEmoji}>
                  {isLoggingIn ? '⏳' : '🔐'}
                </Text>
              </View>
              <Text style={styles.categoryTitle}>
                {isLoggingIn ? '로그인 중...' : 'Adchain 로그인'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.categoryImage, styles.categoryBgPurple]}>
                <Text style={styles.categoryEmoji}>🎯</Text>
              </View>
              <Text style={styles.categoryTitle}>Mission</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.categoryImage, styles.categoryBgBlue]}>
                <Text style={styles.categoryEmoji}>📊</Text>
              </View>
              <Text style={styles.categoryTitle}>Banner</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.categoryImage, styles.categoryBgPink]}>
                <Text style={styles.categoryEmoji}>🎪</Text>
              </View>
              <Text style={styles.categoryTitle}>Offerwall</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.categoryImage, styles.categoryBgYellow]}>
                <Text style={styles.categoryEmoji}>🔔</Text>
              </View>
              <Text style={styles.categoryTitle}>Events</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginHorizontal: CARD_PADDING,
    marginBottom: 16,
  },
  promotionsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  promotionCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  promotionCardPrimary: {
    backgroundColor: '#4A90E2',
  },
  promotionCardSecondary: {
    backgroundColor: '#F5E6D3',
  },
  promotionCardTertiary: {
    backgroundColor: '#E8F4F8',
  },
  promotionContent: {
    flex: 1,
  },
  promotionEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  promotionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  promotionDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 16,
  },
  promotionDescriptionDark: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  promotionButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  promotionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: CARD_PADDING,
    gap: CARD_GAP,
  },
  categoryCard: {
    width: CARD_WIDTH,
  },
  categoryImage: {
    width: '100%',
    height: CARD_WIDTH,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 56,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 8,
  },
  categoryBgGreen: {
    backgroundColor: '#E8F5E9',
  },
  categoryBgOrange: {
    backgroundColor: '#FFF3E0',
  },
  categoryBgPurple: {
    backgroundColor: '#F3E5F5',
  },
  categoryBgBlue: {
    backgroundColor: '#E3F2FD',
  },
  categoryBgPink: {
    backgroundColor: '#FCE4EC',
  },
  categoryBgYellow: {
    backgroundColor: '#FFF9C4',
  },
  categoryCardDisabled: {
    opacity: 0.6,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;

