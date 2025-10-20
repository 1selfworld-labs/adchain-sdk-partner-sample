# AdChain SDK React Native 파트너 샘플

> 🚀 **AdChain SDK를 React Native에 완벽하게 통합하는 샘플 앱입니다.**  
> 네이티브 Offerwall 뷰와 WebView-App 이벤트 브릿지를 통해 최적의 사용자 경험을 제공합니다.

[![SDK Version](https://img.shields.io/badge/Android-v1.0.25-blue)](https://github.com/1selfworld-labs/adchain-sdk-android)
[![SDK Version](https://img.shields.io/badge/iOS-v1.0.41-blue)](https://github.com/1selfworld-labs/adchain-sdk-ios-release)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue)](https://reactnative.dev/)

## 📑 목차

- [🎯 프로젝트 개요](#-프로젝트-개요)
- [🚀 빠른 시작](#-빠른-시작)
- [📦 SDK 연동 가이드](#-sdk-연동-가이드)
  - [1단계: SDK 설치](#1단계-sdk-설치)
  - [2단계: Android 설정](#2단계-android-설정)
  - [3단계: iOS 설정](#3단계-ios-설정)
  - [4단계: React Native 연동](#4단계-react-native-연동)
- [💻 SDK 사용법](#-sdk-사용법)
- [🎨 네이티브 Offerwall](#-네이티브-offerwall)
- [🔔 이벤트 브릿지](#-이벤트-브릿지)
- [📚 API 레퍼런스](#-api-레퍼런스)
- [🆘 문제 해결](#-문제-해결)

---

## 🎯 프로젝트 개요

AdChain SDK를 React Native에 완벽하게 통합하는 **파트너 샘플 앱**입니다.  
WebView 대신 **네이티브 Offerwall 뷰**를 사용하여 최적의 성능과 사용자 경험을 제공합니다.

### ✨ 핵심 특징

- 🚀 **네이티브 Offerwall**: 고성능 네이티브 UI 컴포넌트
- 🔄 **양방향 이벤트 브릿지**: WebView ↔ React Native 실시간 통신
- 📱 **완전한 SDK 통합**: Quiz, Mission, Banner 모든 기능 포함
- 🔒 **자동 로그인 관리**: 사용자 친화적 인증 플로우
- 📝 **TypeScript 지원**: 타입 안전성과 개발 효율성

### 🛠 기술 스택

| 항목         | 버전    | 비고                |
| ------------ | ------- | ------------------- |
| React Native | 0.79.2  | Legacy Architecture |
| Android SDK  | v1.0.25 | API 21+             |
| iOS SDK      | v1.0.41 | iOS 16.0+           |

---

## 🚀 빠른 시작

### 1️⃣ 프로젝트 실행

```bash
# 의존성 설치
npm install

# iOS Pod 설치
cd ios && pod install && cd ..

# 앱 실행
npm run android  # 또는 npm run ios
```

### 2️⃣ 샘플 앱 체험

1. **홈 화면** → "Adchain 로그인" 버튼 클릭
2. **혜택 탭** → 네이티브 Offerwall 뷰 확인
3. **SDK 테스트하기** → 모든 기능 테스트

---

## 📦 SDK 연동 가이드

### 1단계: SDK 설치

#### Android SDK 설치

`android/app/build.gradle`에 의존성 추가:

```gradle
dependencies {
    // AdChain SDK
    implementation 'com.github.1selfworld-labs:adchain-sdk-android:v1.0.25'

    // 필수 의존성
    implementation "org.jetbrains.kotlin:kotlin-stdlib:1.9.21"
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3"
    implementation "com.squareup.retrofit2:retrofit:2.9.0"
    implementation "com.squareup.retrofit2:converter-gson:2.9.0"
    implementation "com.squareup.okhttp3:okhttp:4.12.0"
    implementation 'androidx.core:core:1.10.1'
    implementation 'com.google.android.gms:play-services-ads-identifier:18.0.1'
}
```

#### iOS SDK 설치

`ios/Podfile`에 설정 추가:

```ruby
use_frameworks! :linkage => :static
platform :ios, '16.0'

target 'YourAppName' do
  use_react_native!(
    :path => config[:reactNativePath],
    :app_path => "#{Pod::Config.instance.installation_root}/..",
    :hermes_enabled => true,
    :fabric_enabled => false,
    :new_arch_enabled => false
  )

  # AdChain SDK 추가
  pod 'AdChainSDK', :git => 'https://github.com/1selfworld-labs/adchain-sdk-ios-release.git', :tag => 'v1.0.41'
end
```

```bash
cd ios && pod install && cd ..
```

### 2단계: Android 설정

#### 필수 파일 복사

샘플 프로젝트에서 다음 파일들을 복사:

```bash
android/app/src/main/java/com/adchainsdkpartnersample/
├── AdchainSdkModule.kt              # SDK 기능 브릿지
├── AdchainSdkPackage.kt             # 패키지 등록
└── AdchainOfferwallViewManager.kt   # Offerwall 뷰 매니저
```

#### 패키지명 변경

복사한 파일들의 패키지명을 귀사 프로젝트에 맞게 수정:

```kotlin
// 변경 전
package com.adchainsdkpartnersample

// 변경 후
package com.yourcompany.yourapp
```

#### MainApplication 수정

`MainApplication.kt`에 패키지 등록:

```kotlin
import com.yourcompany.yourapp.AdchainSdkPackage

class MainApplication : Application(), ReactApplication {
  override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
      add(AdchainSdkPackage())  // 추가
    }
}
```

### 3단계: iOS 설정

#### 필수 파일 복사

샘플 프로젝트에서 다음 파일들을 복사:

```bash
ios/AdchainSdkPartnerSample/
├── AdchainSdk.swift                      # SDK 기능 브릿지
├── AdchainSdk.m                          # Objective-C 브릿지
├── AdchainOfferwallViewManager.swift     # Offerwall 뷰 매니저
└── AdchainOfferwallViewManager.m        # Objective-C 브릿지
```

#### Xcode에서 파일 추가

1. Xcode로 프로젝트 열기: `ios/YourApp.xcworkspace`
2. 프로젝트 네비게이터에서 프로젝트 폴더 우클릭 → "Add Files to..."
3. 복사한 4개 파일 선택
4. ✅ **"Copy items if needed"** 체크
5. ✅ 메인 앱 타겟 선택
6. "Add" 클릭

#### Bridging Header 설정

파일 추가 시 "Create Bridging Header" 팝업이 나타나면 **"Create"** 클릭

### 4단계: React Native 연동

#### SDK 초기화

`src/App.tsx`에서 SDK 초기화:

```typescript
import AdchainSdk from './src/services/AdchainSdk';

const App = () => {
  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      await AdchainSdk.initialize({
        appKey: 'YOUR_APP_KEY',
        appSecret: 'YOUR_APP_SECRET',
        environment: 'PRODUCTION',
      });

      // 자동 로그인
      await AdchainSdk.login({
        userId: 'user123',
        gender: 'MALE',
        birthYear: 1990,
      });

      console.log('SDK 초기화 및 로그인 완료');
    } catch (error) {
      console.error('SDK 초기화 실패:', error);
    }
  };

  return (
    // Your app components...
  );
};
```

---

## 💻 SDK 사용법

### 🔐 사용자 인증

```typescript
import AdchainSdk from './src/services/AdchainSdk';

// 로그인
const loginUser = async () => {
  try {
    await AdchainSdk.login({
      userId: 'user123',
      gender: 'MALE', // 선택: 'MALE' | 'FEMALE' | 'OTHER'
      birthYear: 1990, // 선택: 출생년도
    });
    console.log('로그인 성공');
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};

// 로그인 상태 확인
const isLoggedIn = await AdchainSdk.isLoggedIn();
const currentUser = await AdchainSdk.getCurrentUser();

// 로그아웃
await AdchainSdk.logout();
```

### 🎯 Quiz 기능

```typescript
// Quiz 목록 로드
const quizList = await AdchainSdk.loadQuizList('quiz-unit-id');

// Quiz 클릭
await AdchainSdk.clickQuiz('quiz-unit-id', 'quiz-id');
```

### 🎮 Mission 기능

```typescript
// Mission 목록 로드
const missions = await AdchainSdk.loadMissionList('mission-unit-id');

// Mission 클릭
await AdchainSdk.clickMission('mission-unit-id', 'mission-id');

// 리워드 수령
await AdchainSdk.claimReward('mission-unit-id');
```

### 📢 Banner 기능

```typescript
// 배너 정보 로드
const bannerInfo = await AdchainSdk.getBannerInfo('placement-id');
```

---

## 🎨 네이티브 Offerwall

### 기본 사용법

```typescript
import {AdchainOfferwallView} from './src/components/offerwall';

function BenefitScreen() {
  return (
    <AdchainOfferwallView
      placementId="main_tab_offerwall"
      style={{flex: 1}}
      onOfferwallOpened={() => console.log('Offerwall 열림')}
      onOfferwallClosed={() => console.log('Offerwall 닫힘')}
      onOfferwallError={error => console.error('오류:', error)}
      onRewardEarned={amount => console.log('리워드 획득:', amount)}
    />
  );
}
```

### Props

| Prop                | 타입                       | 설명                     | 필수 |
| ------------------- | -------------------------- | ------------------------ | ---- |
| `placementId`       | `string`                   | 배치 ID (추적 및 분석용) | ✅   |
| `style`             | `ViewStyle`                | 뷰 스타일                | ❌   |
| `onOfferwallOpened` | `() => void`               | Offerwall이 열렸을 때    | ❌   |
| `onOfferwallClosed` | `() => void`               | Offerwall이 닫혔을 때    | ❌   |
| `onOfferwallError`  | `(error: string) => void`  | 오류 발생 시             | ❌   |
| `onRewardEarned`    | `(amount: number) => void` | 리워드 획득 시           | ❌   |

### 로그인 상태 관리

Offerwall 컴포넌트는 자동으로 로그인 상태를 확인하고, 로그인이 되지 않은 경우 사용자 친화적인 메시지를 표시합니다.

---

## 🔔 이벤트 브릿지

### 개요

WebView와 React Native 앱 간의 **양방향 통신**을 통해 실시간 이벤트 전달과 데이터 요청이 가능합니다.

> 📅 **현재 상태**: 기본 이벤트 브릿지 구현 완료  
> 🚧 **향후 계획**: 고급 양방향 통신 기능 추가 예정 (v1.1.0)

### 현재 지원 기능

#### 1. 기본 이벤트 처리

```typescript
<AdchainOfferwallView
  placementId="main_offerwall"
  onOfferwallOpened={() => console.log('Offerwall 열림')}
  onOfferwallClosed={() => console.log('Offerwall 닫힘')}
  onOfferwallError={error => console.error('오류:', error)}
  onRewardEarned={amount => console.log('리워드 획득:', amount)}
/>
```

### 향후 추가 예정 기능

#### 1. 커스텀 이벤트 (v1.1.0 예정)

WebView에서 앱으로 커스텀 이벤트를 전송할 수 있습니다.

```typescript
// 향후 지원 예정
<AdchainOfferwallView
  placementId="main_offerwall"
  onCustomEvent={(eventType, payload) => {
    if (eventType === 'show_toast') {
      Alert.alert('메시지', payload.message);
    } else if (eventType === 'navigate') {
      navigation.navigate(payload.screen);
    }
  }}
/>
```

#### 2. 데이터 요청/응답 (v1.1.0 예정)

WebView에서 앱의 데이터를 요청하고 응답받을 수 있습니다.

```typescript
// 향후 지원 예정
<AdchainOfferwallView
  placementId="main_offerwall"
  onDataRequest={(requestType, params) => {
    const responses = {
      user_points: {points: 12345, currency: 'KRW'},
      user_profile: {userId: 'user123', nickname: 'Player1'},
      app_version: {version: '1.0.0', buildNumber: 100},
    };

    return responses[requestType] || null;
  }}
/>
```

### 개발 로드맵

| 버전   | 기능                    | 상태       |
| ------ | ----------------------- | ---------- |
| v1.0.0 | 기본 Offerwall 통합     | ✅ 완료    |
| v1.1.0 | 커스텀 이벤트 브릿지    | 🚧 개발 중 |
| v1.1.0 | 데이터 요청/응답 시스템 | 🚧 개발 중 |
| v1.2.0 | 고급 통신 기능          | 📋 계획 중 |

---

---

## 📚 API 레퍼런스

### 초기화 및 인증

| 메서드             | 파라미터                                        | 반환값                     | 설명             |
| ------------------ | ----------------------------------------------- | -------------------------- | ---------------- |
| `initialize()`     | `{ appKey, appSecret, environment?, timeout? }` | `Promise<SuccessResponse>` | SDK 초기화       |
| `login()`          | `{ userId, gender?, birthYear? }`               | `Promise<SuccessResponse>` | 사용자 로그인    |
| `logout()`         | -                                               | `Promise<SuccessResponse>` | 로그아웃         |
| `isLoggedIn()`     | -                                               | `Promise<boolean>`         | 로그인 상태 확인 |
| `getCurrentUser()` | -                                               | `Promise<User \| null>`    | 현재 사용자 정보 |

### 퀴즈 및 미션

| 메서드              | 파라미터                            | 반환값                     | 설명              |
| ------------------- | ----------------------------------- | -------------------------- | ----------------- |
| `loadQuizList()`    | `unitId: string`                    | `Promise<QuizResponse>`    | Quiz 목록 로드    |
| `clickQuiz()`       | `unitId: string, quizId: string`    | `Promise<SuccessResponse>` | Quiz 클릭         |
| `loadMissionList()` | `unitId: string`                    | `Promise<MissionResponse>` | Mission 목록 로드 |
| `clickMission()`    | `unitId: string, missionId: string` | `Promise<SuccessResponse>` | Mission 클릭      |
| `claimReward()`     | `unitId: string`                    | `Promise<any>`             | 리워드 수령       |

### 광고 및 오퍼월

| 메서드                   | 파라미터                            | 반환값                     | 설명                 |
| ------------------------ | ----------------------------------- | -------------------------- | -------------------- |
| `openOfferwall()`        | `placementId?: string`              | `Promise<SuccessResponse>` | Offerwall 열기       |
| `openOfferwallWithUrl()` | `url: string, placementId?: string` | `Promise<SuccessResponse>` | URL로 Offerwall 열기 |
| `getBannerInfo()`        | `placementId: string`               | `Promise<BannerInfo>`      | 배너 정보 로드       |
| `openExternalBrowser()`  | `url: string`                       | `Promise<SuccessResponse>` | 외부 브라우저 열기   |

---

## 🆘 문제 해결

### 자주 발생하는 문제

#### Q: iOS 빌드 실패

```bash
cd ios
rm -rf Pods Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/AdchainSdkPartnerSample-*
pod install
cd ..
npx react-native run-ios
```

#### Q: Android에서 "Native module AdchainSdk tried to override..." 에러

**원인:** MainApplication에서 AdchainSdkPackage()가 중복 추가됨  
**해결책:** `MainApplication.kt`에서 `add(AdchainSdkPackage())` 한 줄만 있는지 확인

#### Q: TypeScript에서 AdchainSdk를 찾을 수 없음

```bash
# Metro 재시작
npx react-native start --reset-cache

# 앱 재빌드
npx react-native run-android  # 또는 run-ios
```

#### Q: "Module AdchainSdk is not available" 에러

**해결책:** Native 코드 수정 후 전체 재빌드 필요

```bash
# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

#### Q: Offerwall 화면이 로그인 메시지만 표시됨

**원인:** SDK 로그인이 안 됨  
**해결책:**

1. SDK 초기화 확인: `App.tsx`에서 `AdchainSdk.initialize()` 호출 확인
2. 로그인 확인: `AdchainSdk.login()` 호출 확인
3. 로그 확인: `await AdchainSdk.isLoggedIn()` 결과 확인

### 중요 설정

#### iOS 설정

- ✅ **use_frameworks 필수**: `Podfile`에 `use_frameworks! :linkage => :static` 설정
- ✅ **New Architecture 비활성화**: `:fabric_enabled => false, :new_arch_enabled => false`
- ✅ **최소 버전**: iOS 16.0 이상
- ✅ **Bridging Header**: Swift와 Objective-C 브릿지 설정 필수

#### Android 설정

- ✅ **Kotlin 버전**: 1.9.21 이상 권장
- ✅ **Coroutines**: kotlinx-coroutines-android 1.7.3 이상 필요
- ✅ **AndroidX 충돌**: `implementation 'androidx.core:core:1.10.1'` 추가로 해결

---

### 통합 중 문제 발생 시

1. **샘플 앱 실행**: 먼저 샘플 앱이 정상 동작하는지 확인
2. **파일 복사 확인**: 모든 필수 파일이 올바르게 복사되었는지 확인
3. **패키지명 확인**: Android/iOS 패키지명이 정확한지 확인
4. **로그 확인**: 네이티브 로그 (`Logcat`, `Xcode Console`) 확인

---

## 📝 변경 이력

| 날짜       | 버전  | 변경 내용                                                      |
| ---------- | ----- | -------------------------------------------------------------- |
| 2025-10-20 | 1.0.0 | 최초 릴리스 - 네이티브 Offerwall 뷰 및 기본 이벤트 브릿지 지원 |
| 2025-10-20 | 1.1.0 | 고급 양방향 통신 기능 추가 예정 (개발 중)                      |

**Version**: 1.0.0  
**Last Updated**: 2025-10-20  
**React Native**: 0.79.2  
**Android SDK**: v1.0.25  
**iOS SDK**: v1.0.41
