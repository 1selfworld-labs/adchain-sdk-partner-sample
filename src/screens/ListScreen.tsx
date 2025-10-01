import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

type TabType = 'all' | 'saved' | 'shared';

interface ListItem {
  id: string;
  title: string;
  address: string;
  image: string;
}

const MOCK_DATA: ListItem[] = [
  {
    id: '1',
    title: 'SDK 기능 테스트',
    address: 'AdChain SDK 주요 기능',
    image: '🏢',
  },
  {
    id: '2',
    title: 'Quiz 시스템',
    address: '퀴즈 기능 통합 테스트',
    image: '🎯',
  },
  {
    id: '3',
    title: 'Mission 관리',
    address: '미션 완료 및 진행 상태',
    image: '🎮',
  },
  {
    id: '4',
    title: 'Banner 표시',
    address: '배너 광고 통합',
    image: '📱',
  },
  {
    id: '5',
    title: 'Offerwall 연동',
    address: '광고 수익화 시스템',
    image: '💰',
  },
  {
    id: '6',
    title: '사용자 인증',
    address: '로그인 및 회원가입 관리',
    image: '🔐',
  },
  {
    id: '7',
    title: '리워드 시스템',
    address: '포인트 적립 및 관리',
    image: '🎁',
  },
  {
    id: '8',
    title: '알림 설정',
    address: '푸시 알림 및 메시지',
    image: '🔔',
  },
  {
    id: '9',
    title: '결제 시스템',
    address: '인앱 결제 및 구독',
    image: '💳',
  },
  {
    id: '10',
    title: '통계 분석',
    address: '사용자 행동 데이터 분석',
    image: '📊',
  },
  {
    id: '11',
    title: '소셜 공유',
    address: 'SNS 연동 및 공유 기능',
    image: '🌐',
  },
  {
    id: '12',
    title: '이벤트 관리',
    address: '프로모션 및 이벤트 진행',
    image: '🎪',
  },
  {
    id: '13',
    title: '고객 지원',
    address: '1:1 문의 및 FAQ',
    image: '💬',
  },
  {
    id: '14',
    title: '설정 관리',
    address: '앱 환경 설정',
    image: '⚙️',
  },
  {
    id: '15',
    title: '멀티미디어',
    address: '이미지 및 동영상 처리',
    image: '🎬',
  },
];

const ListScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const renderItem = ({item}: {item: ListItem}) => (
    <TouchableOpacity style={styles.listItem}>
      <View style={styles.imageContainer}>
        <Text style={styles.imageEmoji}>{item.image}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = (tabName: string) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📭</Text>
      <Text style={styles.emptyTitle}>No {tabName} Items</Text>
      <Text style={styles.emptyDescription}>
        {tabName} 목록이 비어있습니다
      </Text>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return (
          <FlatList
            data={MOCK_DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'saved':
        return renderEmptyState('Saved');
      case 'shared':
        return renderEmptyState('Shared');
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Header */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('all')}>
          <Text
            style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
          {activeTab === 'all' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('saved')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'saved' && styles.activeTabText,
            ]}>
            Saved
          </Text>
          {activeTab === 'saved' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('shared')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'shared' && styles.activeTabText,
            ]}>
            Shared
          </Text>
          {activeTab === 'shared' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#1A1A1A',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#1A1A1A',
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  itemAddress: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ListScreen;

