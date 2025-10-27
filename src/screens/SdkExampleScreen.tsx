import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import AdchainSdk, {
  addQuizCompletedListener,
  addMissionCompletedListener,
  addMissionProgressedListener,
  addMissionRefreshedListener,
} from '@1selfworld/adchain-sdk-react-native';
import type {AdchainUser} from '@1selfworld/adchain-sdk-react-native';

const SdkExampleScreen = () => {
  // ⭐ 로컬 state로 SDK 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdchainUser | null>(null);

  const [logs, setLogs] = useState<string[]>([]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({
    userId: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    birthYear: 2000,
  });
  const [testData, setTestData] = useState({
    unitId: 'quiz_unit_001',
    quizId: '',
    missionId: '',
    placementId: 'test_banner_1',
    url: 'https://www.google.com',
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  const clearLogs = () => setLogs([]);

  // ⭐ 이벤트 리스너 등록
  useEffect(() => {
    const quizSub = addQuizCompletedListener(event => {
      addLog(`✅ Quiz Completed: ${JSON.stringify(event)}`);
    });

    const missionCompletedSub = addMissionCompletedListener(event => {
      addLog(`✅ Mission Completed: ${JSON.stringify(event)}`);
    });

    const missionProgressSub = addMissionProgressedListener(event => {
      addLog(`⏳ Mission Progressed: ${JSON.stringify(event)}`);
    });

    const missionRefreshSub = addMissionRefreshedListener(event => {
      addLog(`🔄 Mission Refreshed: ${JSON.stringify(event)}`);
    });

    return () => {
      quizSub.remove();
      missionCompletedSub.remove();
      missionProgressSub.remove();
      missionRefreshSub.remove();
    };
  }, []);

  // ===== 로그인/로그아웃 =====

  const handleLogin = async () => {
    try {
      if (!loginData.userId.trim()) {
        Alert.alert('오류', 'User ID를 입력해주세요');
        return;
      }

      await AdchainSdk.login({
        userId: loginData.userId.trim(),
        gender: loginData.gender,
        birthYear: loginData.birthYear,
      });

      setIsLoggedIn(true);
      setCurrentUser({
        userId: loginData.userId.trim(),
        gender: loginData.gender,
        birthYear: loginData.birthYear,
      });

      addLog(`✅ 로그인 성공: ${loginData.userId}`);
      setShowLoginForm(false);
    } catch (error) {
      addLog(`❌ 로그인 실패: ${error}`);
      Alert.alert('로그인 실패', String(error));
    }
  };

  const handleLogout = async () => {
    try {
      await AdchainSdk.logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      addLog('✅ 로그아웃 성공');
    } catch (error) {
      addLog(`❌ 로그아웃 실패: ${error}`);
    }
  };

  // ===== SDK 메서드 테스트 함수들 =====

  const testIsInitialized = async () => {
    try {
      const result = await AdchainSdk.isInitialized();
      addLog(`isInitialized: ${result}`);
      Alert.alert('SDK 초기화 상태', `초기화됨: ${result}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testGetUserId = async () => {
    try {
      const userId = await AdchainSdk.getUserId();
      addLog(`getUserId: ${userId}`);
      Alert.alert('User ID', userId || '(없음)');
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testGetIFA = async () => {
    try {
      const ifa = await AdchainSdk.getIFA();
      addLog(`getIFA: ${ifa}`);
      Alert.alert('IFA (광고 ID)', ifa || '(없음)');
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testGetCurrentUser = async () => {
    try {
      const user = await AdchainSdk.getCurrentUser();
      addLog(`getCurrentUser: ${JSON.stringify(user)}`);
      Alert.alert('현재 사용자', JSON.stringify(user, null, 2));
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testIsLoggedIn = async () => {
    try {
      const result = await AdchainSdk.isLoggedIn();
      addLog(`isLoggedIn: ${result}`);
      Alert.alert('로그인 상태', `로그인됨: ${result}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testLoadQuizList = async () => {
    try {
      addLog(`🚀 loadQuizList 호출: unitId=${testData.unitId}`);
      const result = await AdchainSdk.loadQuizList(testData.unitId);
      if (result.events && result.events.length > 0) {
        const firstQuiz = result.events[0];
        setTestData(prev => ({...prev, quizId: firstQuiz.id}));
        addLog(`📝 퀴즈 ID 자동 설정: ${firstQuiz.id}`);
      }

      Alert.alert(
        'Quiz List 로드 성공',
        `${result.events?.length || 0}개 퀴즈\n\n첫 번째 퀴즈를 clickQuiz 버튼으로 테스트하세요!`,
      );
    } catch (error) {
      addLog(`❌ loadQuizList 에러: ${error}`);
      Alert.alert('Quiz List 로드 실패', String(error));
    }
  };

  const testClickQuiz = async () => {
    try {
      if (!testData.quizId) {
        Alert.alert(
          '오류',
          'Quiz ID가 설정되지 않았습니다.\n먼저 loadQuizList를 실행하세요.',
        );
        addLog('❌ Quiz ID가 비어있음');
        return;
      }

      addLog(
        `🚀 clickQuiz 호출: unitId=${testData.unitId}, quizId=${testData.quizId}`,
      );
      const result = await AdchainSdk.clickQuiz(
        testData.unitId,
        testData.quizId,
      );
      addLog(`✅ clickQuiz 성공: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`❌ clickQuiz 에러: ${error}`);
      Alert.alert('Quiz Click 실패', String(error));
    }
  };

  const testLoadMissionList = async () => {
    try {
      addLog(`🚀 loadMissionList 호출: unitId=${testData.unitId}`);
      const result = await AdchainSdk.loadMissionList(testData.unitId);

      if (result.missions && result.missions.length > 0) {
        const firstMission = result.missions[0];
        setTestData(prev => ({...prev, missionId: firstMission.id}));
        addLog(`📝 미션 ID 자동 설정: ${firstMission.id}`);
      }

      Alert.alert(
        'Mission List 로드 성공',
        `${result.missions?.length || 0}개 미션\n완료: ${result.completedCount}/${result.totalCount}\n\n첫 번째 미션을 clickMission 버튼으로 테스트하세요!`,
      );
    } catch (error) {
      addLog(`❌ loadMissionList 에러: ${error}`);
      Alert.alert('Mission List 로드 실패', String(error));
    }
  };

  const testClickMission = async () => {
    try {
      if (!testData.missionId) {
        Alert.alert(
          '오류',
          'Mission ID가 설정되지 않았습니다.\n먼저 loadMissionList를 실행하세요.',
        );
        addLog('❌ Mission ID가 비어있음');
        return;
      }

      addLog(
        `🚀 clickMission 호출: unitId=${testData.unitId}, missionId=${testData.missionId}`,
      );
      const result = await AdchainSdk.clickMission(
        testData.unitId,
        testData.missionId,
      );
      addLog(`✅ clickMission 성공: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`❌ clickMission 에러: ${error}`);
      Alert.alert('Mission Click 실패', String(error));
    }
  };

  const testClaimReward = async () => {
    try {
      const result = await AdchainSdk.claimReward(testData.unitId);
      addLog(`claimReward: ${JSON.stringify(result)}`);
      Alert.alert('Claim Reward', result.message);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testGetBannerInfo = async () => {
    try {
      const result = await AdchainSdk.getBannerInfo(testData.placementId);
      addLog(`getBannerInfo: ${JSON.stringify(result)}`);
      Alert.alert('Banner Info', JSON.stringify(result, null, 2));
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testOpenOfferwall = async () => {
    try {
      const result = await AdchainSdk.openOfferwall(testData.placementId);
      addLog(`openOfferwall: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testOpenOfferwallWithUrl = async () => {
    try {
      const result = await AdchainSdk.openOfferwallWithUrl(
        testData.url,
        testData.placementId,
      );
      addLog(`openOfferwallWithUrl: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testOpenExternalBrowser = async () => {
    try {
      const result = await AdchainSdk.openExternalBrowser(
        testData.url,
        testData.placementId,
      );
      addLog(`openExternalBrowser: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const testOpenAdjoe = async () => {
    try {
      addLog('Attempting to open Adjoe Offerwall');
      const result = await AdchainSdk.openAdjoeOfferwall('main_adjoe_test');
      addLog(`Adjoe Offerwall result: ${JSON.stringify(result)}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`Adjoe Offerwall error: ${errorMessage}`);
      Alert.alert(
        'Adjoe Offerwall Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* 전체 스크롤 영역 */}
      <ScrollView style={styles.mainScrollView} keyboardShouldPersistTaps="handled">
        {/* SDK 상태 표시 */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>📱 SDK 상태</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>초기화:</Text>
            <Text style={[styles.statusValue, styles.statusGreen]}>
              ✅ 완료
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>로그인:</Text>
            <Text
              style={[
                styles.statusValue,
                isLoggedIn ? styles.statusGreen : styles.statusRed,
              ]}>
              {isLoggedIn ? `✅ ${currentUser?.userId}` : '❌ 미로그인'}
            </Text>
          </View>

          {/* 로그인/로그아웃 버튼 */}
          <View style={styles.authButtons}>
            {!isLoggedIn ? (
              <TouchableOpacity
                style={styles.loginToggleButton}
                onPress={() => setShowLoginForm(!showLoginForm)}>
                <Text style={styles.loginToggleButtonText}>
                  {showLoginForm ? '로그인 폼 닫기' : '🔐 로그인하기'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>🚪 로그아웃</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 로그인 폼 */}
          {showLoginForm && !isLoggedIn && (
            <View style={styles.loginForm}>
              <TextInput
                style={styles.loginInput}
                placeholder="User ID *"
                value={loginData.userId}
                onChangeText={text =>
                  setLoginData(prev => ({...prev, userId: text}))
                }
                autoCapitalize="none"
              />
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    loginData.gender === 'MALE' && styles.genderActive,
                  ]}
                  onPress={() =>
                    setLoginData(prev => ({...prev, gender: 'MALE'}))
                  }>
                  <Text
                    style={[
                      styles.genderText,
                      loginData.gender === 'MALE' && styles.genderTextActive,
                    ]}>
                    남성
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    loginData.gender === 'FEMALE' && styles.genderActive,
                  ]}
                  onPress={() =>
                    setLoginData(prev => ({...prev, gender: 'FEMALE'}))
                  }>
                  <Text
                    style={[
                      styles.genderText,
                      loginData.gender === 'FEMALE' && styles.genderTextActive,
                    ]}>
                    여성
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.loginInput}
                placeholder="Birth Year (예: 1990)"
                value={
                  loginData.birthYear === 0 ? '' : loginData.birthYear.toString()
                }
                onChangeText={text => {
                  const year = text === '' ? 0 : parseInt(text, 10);
                  setLoginData(prev => ({
                    ...prev,
                    birthYear: isNaN(year) ? 0 : year,
                  }));
                }}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>로그인</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 테스트 데이터 입력 섹션 */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>🔧 테스트 데이터</Text>
          <TextInput
            style={styles.input}
            placeholder="Unit ID"
            value={testData.unitId}
            onChangeText={text => setTestData(prev => ({...prev, unitId: text}))}
          />
          <TextInput
            style={[styles.input, testData.quizId && styles.inputFilled]}
            placeholder="Quiz ID (자동 설정됨)"
            value={testData.quizId}
            onChangeText={text => setTestData(prev => ({...prev, quizId: text}))}
          />
          <TextInput
            style={[styles.input, testData.missionId && styles.inputFilled]}
            placeholder="Mission ID (자동 설정됨)"
            value={testData.missionId}
            onChangeText={text =>
              setTestData(prev => ({...prev, missionId: text}))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Placement ID"
            value={testData.placementId}
            onChangeText={text =>
              setTestData(prev => ({...prev, placementId: text}))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="URL"
            value={testData.url}
            onChangeText={text => setTestData(prev => ({...prev, url: text}))}
          />
        </View>

        {/* API 테스트 버튼들 */}
        <View style={styles.apiSection}>
          <Text style={styles.sectionTitle}>📱 AdchainSDK API 테스트</Text>

          {/* 1. 초기화 & 상태 */}
          <View style={styles.apiGroup}>
            <Text style={styles.groupTitle}>1️⃣ 초기화 & 상태 확인</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.apiButton}
                onPress={testIsInitialized}>
                <Text style={styles.buttonText}>isInitialized</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.apiButton} onPress={testGetUserId}>
                <Text style={styles.buttonText}>getUserId</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.apiButton} onPress={testGetIFA}>
                <Text style={styles.buttonText}>getIFA</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. 인증 */}
          <View style={styles.apiGroup}>
            <Text style={styles.groupTitle}>2️⃣ 인증 관리</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.apiButton} onPress={testIsLoggedIn}>
                <Text style={styles.buttonText}>isLoggedIn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.apiButton}
                onPress={testGetCurrentUser}>
                <Text style={styles.buttonText}>getCurrentUser</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              💡 로그인/로그아웃은 상단의 버튼을 사용하세요
            </Text>
          </View>

          {/* 3. Quiz */}
          <View style={styles.apiGroup}>
            <Text style={styles.groupTitle}>3️⃣ Quiz API</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.apiButton}
                onPress={testLoadQuizList}>
                <Text style={styles.buttonText}>loadQuizList</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.apiButton} onPress={testClickQuiz}>
                <Text style={styles.buttonText}>clickQuiz</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Mission */}
          <View style={styles.apiGroup}>
            <Text style={styles.groupTitle}>4️⃣ Mission API</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.apiButton}
                onPress={testLoadMissionList}>
                <Text style={styles.buttonText}>loadMissionList</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.apiButton}
                onPress={testClickMission}>
                <Text style={styles.buttonText}>clickMission</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.apiButton}
                onPress={testClaimReward}>
                <Text style={styles.buttonText}>claimReward</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 5. Banner */}
          <View style={styles.apiGroup}>
            <Text style={styles.groupTitle}>5️⃣ Banner API</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.apiButton}
                onPress={testGetBannerInfo}>
                <Text style={styles.buttonText}>getBannerInfo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 6. Offerwall */}
          <View style={styles.apiGroup}>
            <Text style={styles.groupTitle}>6️⃣ Offerwall API</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.apiButton}
                onPress={testOpenOfferwall}>
                <Text style={styles.buttonText}>openOfferwall</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.apiButton, styles.fullWidth]}
                onPress={testOpenOfferwallWithUrl}>
                <Text style={styles.buttonText}>openOfferwallWithUrl</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.apiButton, styles.fullWidth]}
                onPress={testOpenExternalBrowser}>
                <Text style={styles.buttonText}>openExternalBrowser</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 7. 이벤트 리스너 */}
          <View style={styles.apiGroup}>
            <Text style={styles.groupTitle}>7️⃣ 이벤트 리스너 (자동 등록됨)</Text>
            <View style={styles.eventInfo}>
              <Text style={styles.eventText}>✅ onQuizCompleted</Text>
              <Text style={styles.eventText}>✅ onMissionCompleted</Text>
              <Text style={styles.eventText}>✅ onMissionProgressed</Text>
              <Text style={styles.eventText}>✅ onMissionRefreshed</Text>
            </View>
          </View>

          <View style={styles.apiGroup}>
            <Text style={styles.groupTitle}>8️⃣ Adjoe API</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.apiButton} onPress={testOpenAdjoe}>
                <Text style={styles.buttonText}>openAdjoe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 로그 섹션 - 하단 고정 */}
      <View style={styles.logSection}>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>📋 실행 로그</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
            <Text style={styles.clearButtonText}>지우기</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.logScroll}>
          {logs.length === 0 ? (
            <Text style={styles.emptyLog}>
              API를 실행하면 로그가 표시됩니다
            </Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorBanner: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  mainScrollView: {
    flex: 1,
  },
  statusSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusGreen: {
    color: '#28a745',
  },
  statusRed: {
    color: '#dc3545',
  },
  authButtons: {
    marginTop: 12,
  },
  loginToggleButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  loginToggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loginForm: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    gap: 10,
  },
  loginInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  genderActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  genderTextActive: {
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  inputFilled: {
    backgroundColor: '#e7f3ff',
    borderColor: '#007AFF',
  },
  apiSection: {
    padding: 16,
    paddingBottom: 20,
  },
  apiGroup: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  apiButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  fullWidth: {
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventInfo: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 6,
  },
  eventText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  logSection: {
    height: 150,
    backgroundColor: '#1e1e1e',
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
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
  logScroll: {
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
});

export default SdkExampleScreen;
