import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AdchainSdk, {addQuizCompletedListener} from '../../../../test-rn/my-app/src/index';
import {BannerInfo} from '../../../../test-rn/my-app/src/interface/banner';
import {CompletedQuizBanner, QuizItem} from '../../../../test-rn/my-app/src/interface/quiz';
import Banner from '../banner';
import QuizModule from './QuizModule';
import QuizSkeleton from './QuizSkeleton';

// UI Quiz 타입

const QUIZ_UNIT_ID = 'quiz_unit_001'; // Quiz Unit ID
const BANNER_UNIT_ID = 'banner_unit_001'; // Banner Unit ID

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

interface QuizCache {
  data: QuizItem[];
  timestamp: number;
}

// Global cache store
let quizCache: QuizCache | null = null;

interface IProps {
  isLoggedIn: boolean;
}

export const Quiz = ({isLoggedIn}: IProps) => {
  const [networkError, setNetworkError] = useState(false);
  const [networkError2, setNetworkError2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [quizTitleText, setQuizTitleText] = useState<string>('데일리 1분 퀴즈'); // 퀴즈 타이틀 텍스트
  const [bannerInfo, setBannerInfo] = useState<BannerInfo | null>(null);
  const [completedQuizBanner, setCompletedQuizBanner] =
    useState<CompletedQuizBanner>({
      completedImageHeight: 0,
      completedImageUrl: '',
      completedImageWidth: 0,
    });
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Cache validation
  const isCacheValid = () => {
    return quizCache && Date.now() - quizCache.timestamp < CACHE_DURATION;
  };

  const getBannerInfo = async () => {
    const bannerInfo = await AdchainSdk.getBannerInfo(BANNER_UNIT_ID);
    setBannerInfo(bannerInfo);
    console.log('Banner info:', bannerInfo);
  };

  // Initial load with cache check
  useEffect(() => {
    if (isCacheValid() && quizCache) {
      // Use cached data immediately
      setQuizItems(quizCache.data);
      setLoading(false);
      setShowSkeleton(false);
      fadeAnim.setValue(1);

      // Background refresh if cache is getting old (>2 minutes)
      if (Date.now() - quizCache.timestamp > 2 * 60 * 1000) {
        loadQuizList(true); // Silent background refresh
      }
    }
    getBannerInfo();
    loadQuizList();
  }, []);

  useEffect(() => {
    // 퀴즈 완료 이벤트 리스너 등록
    const subscription = addQuizCompletedListener(event => {
      console.log('📱 [React Native] Quiz completed event received:', event);

      // 해당 unit의 퀴즈인 경우 캐시 무효화 후 새로고침
      if (event.unitId === QUIZ_UNIT_ID) {
        console.log('🔄 Invalidating cache and refreshing quiz list');
        quizCache = null; // Invalidate cache
        loadQuizList(); // Force refresh
      }
    });

    // cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  // SDK에서 퀴즈 리스트 로드 (캐싱 포함)
  const loadQuizList = async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        setLoading(true);
        setShowSkeleton(true);
        setNetworkError(false);
        fadeAnim.setValue(0);
      }

      // SDK에서 실제 퀴즈 데이터 로드 (이제 전체 응답 반환)
      const quizResponse = await AdchainSdk.loadQuizList(QUIZ_UNIT_ID);
      console.log('Quiz response:', quizResponse);
      const sdkCompletedBanner = {
        completedImageHeight: quizResponse.completedImageHeight || 0,
        completedImageUrl: quizResponse.completedImageUrl || '',
        completedImageWidth: quizResponse.completedImageWidth || 0,
      };
      const sdkQuizList: any[] = quizResponse.events || [];

      // titleText가 있으면 업데이트
      if (quizResponse.titleText) {
        setQuizTitleText(quizResponse.titleText);
        setCompletedQuizBanner(sdkCompletedBanner);
      }

      // 디버깅: SDK 응답 확인
      console.log('SDK Quiz Response:', JSON.stringify(sdkQuizList, null, 2));

      // SDK 데이터를 UI 형식으로 변환
      const transformedQuizList: QuizItem[] = sdkQuizList.map((quiz: any) => {
        console.log('Quiz item:', quiz);
        return {
          id: quiz.id,
          imageUrl: quiz.imageUrl || 'https://via.placeholder.com/240',
          titleText: quiz.title,
          rewardsText: quiz.point || '0 포인트', // point 필드 그대로 사용
          url: `https://quiz.adchain.com/${quiz.id}`, // 실제 URL은 SDK에서 제공될 예정
          isCompleted: quiz.isCompleted,
        };
      });

      // Update cache
      quizCache = {
        data: transformedQuizList,
        timestamp: Date.now(),
      };

      // Update UI
      setQuizItems(transformedQuizList);

      if (!isBackgroundRefresh) {
        // Smooth fade in animation
        setShowSkeleton(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error('Quiz load error:', error);
      setNetworkError(true);

      if (!isBackgroundRefresh) {
        setShowSkeleton(false);
        fadeAnim.setValue(1);
      }
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false);
      }
    }
  };

  // 퀴즈 클릭 처리
  const handleQuizClick = async (quiz: QuizItem) => {
    try {
      if (quiz.id) {
        // SDK를 통해 퀴즈 클릭 이벤트 전송
        const result = await AdchainSdk.clickQuiz(QUIZ_UNIT_ID, quiz.id);
        console.log('Quiz clicked:', result);

        // 이벤트 리스너가 자동으로 처리하므로 여기서는 새로고침 하지 않음
        // loadQuizList()는 이벤트 리스너에서 처리됨
      }
    } catch (error) {
      console.error('Quiz click error:', error);
    }
  };

  // Offerwall 열기
  const handleOpenOfferwall = async () => {
    try {
      const result = await AdchainSdk.openOfferwall('QUIZ_EMPTY_OFFERWALL');
      console.log('Offerwall opened:', result);
    } catch (error) {
      console.error('Offerwall error:', error);
    }
  };

  const handleRefresh = () => {
    quizCache = null; // Invalidate cache on manual refresh
    loadQuizList();
  };

  // SDK 테스트 버튼 핸들러
  const handleTestOfferwallWithUrl = async () => {
    try {
      // Banner 1 정보를 가져와서 URL 사용
      const banner1 = await AdchainSdk.getBannerInfo('test_banner_1');
      console.log('Banner 1 info for Offerwall test:', banner1);

      if (banner1.internalLinkUrl) {
        const result = await AdchainSdk.openOfferwallWithUrl(
          banner1.internalLinkUrl,
          'INTERNAL_LINK',
        );
        console.log('Offerwall with URL opened:', result);
      } else {
        console.log('No internalLinkUrl in banner 1');
        // 테스트용 기본 URL 사용
        const result = await AdchainSdk.openOfferwallWithUrl(
          'https://reward.adchain.plus?test=offerwall',
          'EXTERNAL_LINK',
        );
        console.log('Offerwall with default URL opened:', result);
      }
    } catch (error) {
      console.error('Offerwall with URL error:', error);
    }
  };

  const handleTestExternalBrowser = async () => {
    try {
      // Banner 2 정보를 가져와서 URL 사용
      const banner2 = await AdchainSdk.getBannerInfo('test_banner_2');
      console.log('Banner 2 info for Browser test:', banner2);

      if (banner2.externalLinkUrl) {
        const result = await AdchainSdk.openExternalBrowser(
          banner2.externalLinkUrl,
          'test4',
        );
        console.log('External browser opened:', result);
      } else {
        console.log('No externalLinkUrl in banner 2');
        // 테스트용 기본 URL 사용
        const result = await AdchainSdk.openExternalBrowser(
          'https://www.google.com',
          'test4',
        );
        console.log('External browser with default URL opened:', result);
      }
    } catch (error) {
      console.error('External browser error:', error);
    }
  };

  return (
    <View>
      {/* 개발자 컨트롤 패널 - jun 샘플과 동일 */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Network Error:</Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              networkError ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={() => setNetworkError(!networkError)}>
            <Text style={styles.toggleText}>{networkError ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Network Error #2:</Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              networkError2 ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={() => setNetworkError2(!networkError2)}>
            <Text style={styles.toggleText}>
              {networkError2 ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 퀴즈 모듈 */}
      <View style={styles.quizModuleContainer}>
        {showSkeleton ? (
          <QuizSkeleton count={10} />
        ) : (
          <Animated.View style={{opacity: fadeAnim}}>
            <QuizModule
              titleText={quizTitleText}
              quizItems={quizItems}
              completedQuizBanner={completedQuizBanner}
              networkError={networkError}
              networkError2={networkError2}
              onRefresh={handleRefresh}
              loading={loading}
              onQuizClick={handleQuizClick}
              onOpenOfferwall={handleOpenOfferwall}
            />
          </Animated.View>
        )}
        {isLoggedIn && bannerInfo && (
          <Banner bannerInfo={bannerInfo} placementId={BANNER_UNIT_ID} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quizModuleContainer: {
    paddingVertical: 20,
    gap: 50,
  },
  controlsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 12,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  toggleButton: {
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleInactive: {
    backgroundColor: '#E0E0E0',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  countButton: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  testButtonsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  testSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  testButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  testButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  testButtonSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default Quiz;
