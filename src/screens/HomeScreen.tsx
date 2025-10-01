import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
                <View style={styles.promotionButton}>
                  <Text style={styles.promotionButtonText}>시작하기 →</Text>
                </View>
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

            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.categoryImage, styles.categoryBgOrange]}>
                <Text style={styles.categoryEmoji}>❓</Text>
              </View>
              <Text style={styles.categoryTitle}>Quiz</Text>
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
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;

