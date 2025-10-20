import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AdchainOfferwallView from '../components/offerwall';
import { WEBVIEW_CONFIG } from '../components/webview/webview.config';

/**
 * 새로운 AdchainOfferwallView 컴포넌트를 테스트하기 위한 화면
 */
const OfferwallTestScreen: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <View style={styles.container}>
      {/* 이벤트 로그 섹션 */}
      <View style={styles.logSection}>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>📋 Event Log</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearEvents}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logContainer}>
          {events.length === 0 ? (
            <Text style={styles.emptyLog}>Events will appear here...</Text>
          ) : (
            events.map((event, index) => (
              <Text key={index} style={styles.logText}>
                {event}
              </Text>
            ))
          )}
        </View>
      </View>

      {/* Offerwall View */}
      <View style={styles.offerwallContainer}>
        <Text style={styles.sectionTitle}>🎁 Adchain Offerwall</Text>
        <Text style={styles.debugText}>
          Debug: URL = {'https://adchain-offerwall-ddocdoc.1self.world/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=Android&app_key=100000001&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.33'}
        </Text>
        <AdchainOfferwallView
          url={'https://adchain-offerwall-ddocdoc.1self.world/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=Android&app_key=100000001&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.33'}
          style={styles.offerwallView}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logSection: {
    height: 200,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#2d2d2d',
  },
  logTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  logContainer: {
    flex: 1,
    padding: 8,
  },
  logText: {
    color: '#00ff00',
    fontSize: 11,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  emptyLog: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  offerwallContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 8,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    padding: 4,
    borderRadius: 4,
  },
  offerwallView: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    height: 500, // 명시적인 높이 설정
    width: '100%', // 전체 너비
  },
});

export default OfferwallTestScreen;
