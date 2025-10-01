import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

interface SavedItem {
  id: string;
  title: string;
  address: string;
  image: string;
}

interface Collection {
  id: string;
  title: string;
  itemCount: number;
  image: string;
}

const SAVED_DATA: SavedItem[] = [
  {
    id: '1',
    title: 'SDK 통합 가이드',
    address: 'AdChain SDK 설치 및 설정',
    image: '🏢',
  },
  {
    id: '2',
    title: 'Quiz 구현 방법',
    address: '퀴즈 시스템 완벽 가이드',
    image: '🎯',
  },
  {
    id: '3',
    title: 'Mission 최적화',
    address: '미션 성능 개선 팁',
    image: '🏠',
  },
  {
    id: '4',
    title: 'Banner 광고 설정',
    address: '배너 최적 배치 전략',
    image: '🏘️',
  },
  {
    id: '5',
    title: 'Offerwall 수익화',
    address: '광고 수익 극대화 방법',
    image: '🏰',
  },
  {
    id: '6',
    title: '사용자 분석',
    address: '데이터 기반 최적화',
    image: '🏛️',
  },
  {
    id: '7',
    title: '푸시 알림 전략',
    address: '효과적인 알림 설정',
    image: '🏗️',
  },
];

const COLLECTIONS_DATA: Collection[] = [
  {
    id: '1',
    title: 'SDK 핵심 기능',
    itemCount: 8,
    image: '🏡',
  },
  {
    id: '2',
    title: '광고 수익화',
    itemCount: 5,
    image: '🏢',
  },
  {
    id: '3',
    title: '사용자 참여',
    itemCount: 12,
    image: '🏠',
  },
  {
    id: '4',
    title: '분석 도구',
    itemCount: 6,
    image: '📊',
  },
  {
    id: '5',
    title: '최적화 가이드',
    itemCount: 9,
    image: '⚡',
  },
  {
    id: '6',
    title: '보안 설정',
    itemCount: 4,
    image: '🔒',
  },
];

const FavoriteScreen = () => {
  const renderSavedItem = (item: SavedItem) => (
    <TouchableOpacity key={item.id} style={styles.savedItem}>
      <View style={styles.imageContainer}>
        <Text style={styles.imageEmoji}>{item.image}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCollectionItem = (item: Collection) => (
    <TouchableOpacity key={item.id} style={styles.collectionItem}>
      <View style={styles.imageContainer}>
        <Text style={styles.imageEmoji}>{item.image}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemCount}>{item.itemCount} items</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Saved Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved</Text>
        {SAVED_DATA.map(renderSavedItem)}
      </View>

      {/* Collections Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collections</Text>
        {COLLECTIONS_DATA.map(renderCollectionItem)}
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  savedItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  collectionItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  imageEmoji: {
    fontSize: 40,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemAddress: {
    fontSize: 15,
    color: '#8E8E93',
  },
  itemCount: {
    fontSize: 15,
    color: '#8E8E93',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default FavoriteScreen;

