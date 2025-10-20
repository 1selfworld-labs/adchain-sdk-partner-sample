# AdChain SDK Partner Sample

이 프로젝트는 [**AdChain SDK**](https://github.com/1selfworld-labs/adchain-sdk-ios-release)를 React Native 환경에서 사용하는 방법을 보여주는 샘플 애플리케이션입니다.

## 📋 프로젝트 개요

- **React Native 버전**: 0.79.2
- **AdChain SDK 버전**: v1.0.33
- **최소 지원 iOS 버전**: 14.0
- **아키텍처**: Legacy Architecture (New Architecture 비활성화)

## 🚀 AdChain SDK 퀵 설정 가이드

### 1️⃣ 원클릭 로그인 (HomeScreen)

**홈 화면**에서 **"Adchain 로그인"** 버튼을 클릭하면 자동으로 AdChain SDK가 설정됩니다:

- 🔐 **위치**: 홈 화면 > Featured Categories > Adchain 로그인
- ⚡ **자동 처리**: SDK 초기화 → 임시 사용자 생성 → 로그인 완료
- 🎯 **임시 사용자**: `temp_user_${timestamp}` 형식으로 자동 생성
- 📱 **플랫폼 설정**: Android/iOS 각각의 설정 자동 적용

### 2️⃣ 웹뷰 화면 확인 (혜택 탭)

**혜택 탭**을 클릭하면 AdChain의 웹뷰 화면을 바로 확인할 수 있습니다:

- 🎁 **위치**: 하단 네비게이션 > 혜택 탭
- 🌐 **기능**: AdChain 오퍼월 웹페이지 표시
- 🔄 **통신**: 웹 ↔ React Native 실시간 메시지 처리
- 📊 **이벤트**: 스크롤, 클릭, 커스텀 이벤트 추적

### 3️⃣ 웹뷰 설정 수정

`src/components/webview/webview.config.ts` 파일에서 다음 요소들을 수정할 수 있습니다:

#### 🔧 개발 환경 URL 변경

```typescript
// 현재 설정 (예시)
DEFAULT_URL: 'https://adchain-offerwall-ddocdoc.1self.world/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=IOS&app_key=123456781&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.35';
```

#### 📱 주요 파라미터 설정

```typescript
// 필수 파라미터들
user_id: 'ac_PrdDDYvb2YOTU0hHkBa0ZQ'; // 사용자 ID
app_key: '123456781'; // 앱 키
platform: 'IOS'; // 플랫폼 (IOS/ANDROID)
ifa: '32e197b8-56a2-49e2-8207-c573425c1b3b'; // 광고 ID
sdk_version: '1.0.35'; // SDK 버전
```

### 4️⃣ SDK 기능 테스트

로그인 후 **"SDK 테스트하기"** 버튼으로 모든 SDK 기능을 테스트할 수 있습니다:

- 📱 **상태 확인**: 초기화, 로그인 상태 모니터링
- 🧪 **API 테스트**: Quiz, Mission, Banner, Offerwall 기능
- 📋 **실시간 로그**: 모든 API 호출과 이벤트 로그 확인

## 📁 프로젝트 구조

```
src/
├── App.tsx                      # 메인 앱 컴포넌트
├── services/
│   └── AdchainSdk.tsx          # AdChain SDK React Native 래퍼
├── navigation/
│   └── AppNavigator.tsx        # 네비게이션 설정
├── screens/
│   ├── HomeScreen.tsx          # 홈 화면
│   ├── SdkExampleScreen.tsx    # SDK 기능 데모 화면 (주요 샘플)
│   ├── BenefitScreen.tsx       # 혜택 화면
│   ├── FavoriteScreen.tsx      # 즐겨찾기 화면
│   ├── ListScreen.tsx          # 리스트 화면
│   └── MyPageScreen.tsx        # 마이페이지 화면
├── components/
│   ├── banner/                 # 배너 컴포넌트
│   │   └── index.tsx
│   ├── mission/                # 미션 관련 컴포넌트
│   │   ├── index.tsx
│   │   ├── MissionModule.tsx
│   │   └── MissionSkeleton.tsx
│   ├── quiz/                   # 퀴즈 관련 컴포넌트
│   │   ├── index.tsx
│   │   ├── QuizModule.tsx
│   │   └── QuizSkeleton.tsx
│   └── webview/                # 웹뷰 컴포넌트
│       ├── index.tsx
│       └── webview.config.ts
└── Storage.ts                  # 로컬 스토리지 유틸리티
```

### 💡 SDK 기능 둘러보기

**`SdkExampleScreen.tsx`**를 통해 AdChain SDK의 모든 주요 기능을 확인할 수 있습니다:

- SDK 초기화 (Initialize)
- 사용자 로그인/로그아웃
- 퀴즈 기능 (Quiz)
- 미션 기능 (Mission)
- 배너 기능 (Banner)
- 오퍼월 기능 (Offerwall)

## ⚠️ iOS 설정 시 주의사항 (React Native 0.77+)

### 문제점

React Native 0.77 이상 버전에서는 AppDelegate가 **Objective-C에서 Swift로 변경**되었습니다. 이로 인해 Objective-C로 작성된 네이티브 모듈(AdChain SDK 포함)이 제대로 인식되지 않을 수 있습니다.

### 해결 방법

#### 1. AppDelegate를 Objective-C로 변경

**기존 Swift AppDelegate 삭제:**

```
ios/AdchainSdkPartnerSample/AppDelegate.swift (삭제)
```

**Objective-C AppDelegate 추가:**

```
ios/AdchainSdkPartnerSample/AppDelegate.h
ios/AdchainSdkPartnerSample/AppDelegate.mm
ios/AdchainSdkPartnerSample/main.m
```

#### 2. Xcode 프로젝트 설정 수정 (`project.pbxproj`)

**필수 파일 등록:**

- `AppDelegate.h` - 헤더 파일
- `AppDelegate.mm` - 구현 파일
- `main.m` - 앱 진입점

**변경해야 할 섹션:**

```
/* Begin PBXBuildFile section */
- AppDelegate.swift in Sources 제거
+ AppDelegate.mm in Sources 추가
+ main.m in Sources 추가

/* Begin PBXFileReference section */
- AppDelegate.swift 참조 제거
+ AppDelegate.h 참조 추가
+ AppDelegate.mm 참조 추가
+ main.m 참조 추가

/* Begin PBXGroup section */
- AppDelegate.swift 제거
+ AppDelegate.h 추가
+ AppDelegate.mm 추가
+ main.m 추가

/* Begin PBXSourcesBuildPhase section */
- AppDelegate.swift in Sources 제거
+ AppDelegate.mm in Sources 추가
+ main.m in Sources 추가
```

#### 3. Bridging Header 설정

**`AdchainSdkPartnerSample-Bridging-Header.h`** 파일에 필수 헤더 포함:

```objc
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
```

**Xcode Build Settings에서 확인:**

- `SWIFT_OBJC_BRIDGING_HEADER` = `"AdchainSdkPartnerSample/AdchainSdkPartnerSample-Bridging-Header.h"`
- `SWIFT_PRECOMPILE_BRIDGING_HEADER` = `YES`

#### 4. Podfile 설정

**Legacy Architecture 사용:**

```ruby
platform :ios, '14.0'
use_frameworks! :linkage => :static

use_react_native!(
  :path => config[:reactNativePath],
  :app_path => "#{Pod::Config.instance.installation_root}/..",
  :hermes_enabled => true,
  # New Architecture 비활성화 (필수!)
  :fabric_enabled => false,
  :new_arch_enabled => false
)
```

#### 5. 캐시 정리 및 재설치

```sh
# iOS 캐시 정리
cd ios
rm -rf build/ Pods/ Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/AdchainSdkPartnerSample-*

# 의존성 재설치
pod install

# 프로젝트 클린
xcodebuild clean -workspace AdchainSdkPartnerSample.xcworkspace -scheme AdchainSdkPartnerSample
```

### 확인 사항

pod install 실행 시 다음 메시지가 표시되어야 합니다:

```
✅ Configuring the target with the Legacy Architecture
```

만약 `New Architecture`로 표시되면 위 설정을 다시 확인하세요.

## 🚀 AdChain SDK 설정

### Info.plist 설정

AdChain SDK가 URL 스킴을 처리할 수 있도록 `Info.plist`에 다음 설정을 추가하세요:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>adchain</string>
</array>
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>adchain</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>adchain</string>
        </array>
    </dict>
</array>
```

### AppDelegate.mm 설정

URL 스킴 처리를 위한 메서드 추가:

```objc
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([url.scheme containsString:@"adchain"]) {
    return YES;
  }
  return NO;
}
```

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

iOS의 경우 CocoaPods 의존성을 설치해야 합니다.

**처음 프로젝트를 클론한 경우:**

```sh
# 1. Node 모듈 설치
npm install

# 2. iOS 의존성 설치
cd ios
pod install
cd ..

# 3. 앱 실행
npm run ios
```

**의존성 업데이트 시:**

```sh
cd ios
pod install
cd ..
```

**⚠️ 중요**: pod install 실행 시 반드시 **"Legacy Architecture"** 메시지가 표시되어야 합니다.

더 자세한 정보는 [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html)를 참조하세요.

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

## AdChain SDK 관련 문제

### 1. "Undefined symbol: \_main" 에러

**원인**: `main.m` 파일이 빌드 타겟에 포함되지 않았습니다.

**해결책**:

- `main.m` 파일이 `ios/AdchainSdkPartnerSample/` 폴더에 존재하는지 확인
- `project.pbxproj` 파일에서 `main.m`이 `PBXBuildFile`, `PBXFileReference`, `PBXSourcesBuildPhase`에 모두 등록되었는지 확인

### 2. "RCTEventEmitter module not registered" 에러

**원인**: New Architecture가 활성화되어 있어 네이티브 모듈이 제대로 등록되지 않았습니다.

**해결책**:

```ruby
# Podfile에서 New Architecture 비활성화
use_react_native!(
  :fabric_enabled => false,
  :new_arch_enabled => false
)
```

### 3. "Build input file cannot be found: Bridging-Header.h" 에러

**원인**: 브리징 헤더 파일 경로가 잘못되었습니다.

**해결책**:

- 브리징 헤더 파일이 `ios/AdchainSdkPartnerSample/AdchainSdkPartnerSample-Bridging-Header.h` 경로에 있는지 확인
- `project.pbxproj`에서 `SWIFT_OBJC_BRIDGING_HEADER` 경로가 `"AdchainSdkPartnerSample/AdchainSdkPartnerSample-Bridging-Header.h"`로 설정되었는지 확인
- 브리징 헤더 파일에 `#endif` 종료 태그가 있는지 확인

### 4. AdChain SDK 초기화 실패

**원인**: Info.plist에 URL 스킴이 설정되지 않았습니다.

**해결책**:

- `Info.plist`에 `LSApplicationQueriesSchemes`와 `CFBundleURLTypes` 추가 (위 설정 참조)
- `AppDelegate.mm`에 URL 스킴 처리 메서드 추가 (위 코드 참조)

## 일반적인 문제

기타 문제는 [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) 페이지를 참조하세요.

# 📱 AdChain SDK 사용 예제

## SDK 초기화

```typescript
import AdchainSdk from './services/AdchainSdk';

// SDK 초기화
await AdchainSdk.initialize('YOUR_APP_KEY', 'YOUR_APP_SECRET', {
  environment: 'production', // 'development' | 'staging' | 'production'
  timeout: 30000,
});
```

## 사용자 로그인

```typescript
await AdchainSdk.login('user123', {
  gender: 'M',
  birthYear: 1990,
});
```

## 퀴즈 기능

```typescript
// 퀴즈 목록 로드
const quizList = await AdchainSdk.loadQuizList('quiz-unit-id');

// 퀴즈 클릭
await AdchainSdk.clickQuiz('quiz-unit-id', 'quiz-id');
```

## 미션 기능

```typescript
// 미션 목록 로드
const missions = await AdchainSdk.loadMissionList('mission-unit-id');

// 미션 클릭
await AdchainSdk.clickMission('mission-unit-id', 'mission-id');

// 리워드 수령
await AdchainSdk.claimReward('mission-unit-id');
```

## 배너 기능

```typescript
const bannerInfo = await AdchainSdk.getBannerInfo('placement-id');
```

## 오퍼월 기능

```typescript
// 오퍼월 열기
await AdchainSdk.openOfferwall('placement-id');

// URL로 오퍼월 열기
await AdchainSdk.openOfferwallWithUrl('https://example.com', 'placement-id');
```

더 자세한 사용 예제는 **`src/screens/SdkExampleScreen.tsx`** 파일을 참조하세요.

## 🌐 웹뷰 설정 상세 가이드

### 웹뷰 설정 파일 구조

`src/components/webview/webview.config.ts` 파일의 주요 구성 요소:

```typescript
export const WEBVIEW_CONFIG = {
  // 개발 환경 URL (로컬 서버)
  DEFAULT_URL:
    'https://adchain-offerwall-ddocdoc.1self.world/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=IOS&app_key=123456781&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.35',

  // 프로덕션 환경 URL
  PRODUCTION_URL:
    'https://adchain-offerwall.1self.world?user_id=test123456&app_key=123456781&platform=ios&ifa=00000000-0000-0000-0000-000000000000&sdk_version=1.0.15&device_id=1234567890&device_model=iPhone16&device_manufacturer=Apple&session_id=1234567890&os_version=1.0.15&screen_width=1080&screen_height=1920&timestamp=1727731200',
};
```

### 필수 수정 요소

#### 1. config setting

```typescript
// 현재 설정 (예시)
DEFAULT_URL: 'https://adchain-offerwall-ddocdoc.1self.world/?user_id=ac_PrdDDYvb2YOTU0hHkBa0ZQ&platform=IOS&app_key=123456781&ifa=32e197b8-56a2-49e2-8207-c573425c1b3b&sdk_version=1.0.35';
```

#### 2. 프로덕션 환경 설정

```typescript
// 프로덕션 URL (실제 배포 시 사용)
PRODUCTION_URL: 'https://adchain-offerwall.1self.world?user_id=test123456&app_key=123456781&platform=ios&ifa=00000000-0000-0000-0000-000000000000&sdk_version=1.0.15&device_id=1234567890&device_model=iPhone16&device_manufacturer=Apple&session_id=1234567890&os_version=1.0.15&screen_width=1080&screen_height=1920&timestamp=1727731200';
```

### 환경별 URL 자동 전환

```typescript
// 현재 사용할 URL 선택 함수
export const getCurrentWebViewUrl = () => {
  // 개발 모드에서 자동으로 DEFAULT_URL 사용
  if (__DEV__) {
    return WEBVIEW_CONFIG.DEFAULT_URL;
  }

  // 프로덕션 모드에서 자동으로 PRODUCTION_URL 사용
  return WEBVIEW_CONFIG.PRODUCTION_URL;
};
```

### 웹뷰 이벤트 처리

웹뷰에서 React Native로 전송되는 이벤트들:

- **스크롤 이벤트**: 사용자 스크롤 위치 추적
- **클릭 이벤트**: 웹 요소 클릭 감지
- **커스텀 이벤트**: `adchain_event` 타입 이벤트 처리
- **포인트 이벤트**: `membership_point_clicked` 시 네이티브 알림 표시

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
