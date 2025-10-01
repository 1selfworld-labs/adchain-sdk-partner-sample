import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
}

const ACCOUNT_MENU: MenuItem[] = [
  {id: '1', title: 'Profile', icon: '👤'},
  {id: '2', title: 'Payment Methods', icon: '💳'},
  {id: '3', title: 'Notifications', icon: '🔔'},
  {id: '4', title: 'Settings', icon: '⚙️'},
];

const SUPPORT_MENU: MenuItem[] = [
  {id: '1', title: 'Help Center', icon: '❓'},
  {id: '2', title: 'Contact Us', icon: '✉️'},
];

const MyPageScreen = () => {
  const handleMenuPress = (title: string) => {
    Alert.alert('알림', `${title} 메뉴를 선택했습니다.`);
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.title)}>
      <View style={styles.menuIconContainer}>
        <Text style={styles.menuIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.menuTitle}>{item.title}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileEmoji}>👤</Text>
        </View>
        <Text style={styles.profileName}>AdChain User</Text>
        <Text style={styles.profileBadge}>Premium Member</Text>
        <Text style={styles.profileJoined}>Joined 2024</Text>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {ACCOUNT_MENU.map(renderMenuItem)}
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        {SUPPORT_MENU.map(renderMenuItem)}
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0D5B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileEmoji: {
    fontSize: 60,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  profileBadge: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  profileJoined: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitle: {
    flex: 1,
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 28,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default MyPageScreen;

