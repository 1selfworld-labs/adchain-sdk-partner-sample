import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  requireNativeComponent,
  ViewStyle,
  UIManager,
  findNodeHandle,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import AdchainSdk from '../../services/AdchainSdk';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Event types for Offerwall callbacks
 */
interface OfferwallErrorEvent {
  nativeEvent: {
    error: string;
  };
}

interface OfferwallRewardEvent {
  nativeEvent: {
    amount: number;
  };
}

interface OfferwallHeightChangeEvent {
  nativeEvent: {
    height: number;
  };
}

/**
 * Custom event from WebView
 * @since 1.0.41
 */
interface OfferwallCustomEvent {
  nativeEvent: {
    eventType: string;
    payload: any;
  };
}

/**
 * Data request from WebView
 * @since 1.0.41
 */
interface OfferwallDataRequestEvent {
  nativeEvent: {
    requestId: string;
    requestType: string;
    params: any;
  };
}

/**
 * Props for AdchainOfferwallView component
 */
export interface AdchainOfferwallViewProps {
  /** Placement ID for tracking and analytics */
  placementId: string;
  /** View style */
  style?: ViewStyle;
  /** Callback when offerwall is opened */
  onOfferwallOpened?: () => void;
  /** Callback when offerwall is closed */
  onOfferwallClosed?: () => void;
  /** Callback when an error occurs */
  onOfferwallError?: (error: string) => void;
  /** Callback when user earns a reward */
  onRewardEarned?: (amount: number) => void;

  // ===== NEW: Event Bridge Callbacks (v1.0.41+) =====

  /**
   * Callback when WebView sends a custom event
   * @param eventType - Type of event (e.g., "navigate", "show_toast")
   * @param payload - Event data
   * @since 1.0.41
   */
  onCustomEvent?: (eventType: string, payload: any) => void;

  /**
   * Callback when WebView requests data from the app
   * @param requestType - Type of data requested (e.g., "user_points", "user_profile")
   * @param params - Request parameters
   * @returns Data to send back to WebView, or null/undefined if unavailable
   * @since 1.0.41
   */
  onDataRequest?: (requestType: string, params: any) => any;
}

/**
 * Native component interface
 */
interface NativeOfferwallViewProps {
  style?: ViewStyle;
  placementId?: string;  // Both iOS and Android now use property
  onOfferwallOpened?: () => void;
  onOfferwallClosed?: () => void;
  onOfferwallError?: (event: OfferwallErrorEvent) => void;
  onRewardEarned?: (event: OfferwallRewardEvent) => void;
  onHeightChange?: (event: OfferwallHeightChangeEvent) => void;
  onCustomEvent?: (event: OfferwallCustomEvent) => void;  // NEW
  onDataRequest?: (event: OfferwallDataRequestEvent) => void;  // NEW
}

// Require native component
const NativeOfferwallView = requireNativeComponent<NativeOfferwallViewProps>('AdchainOfferwallView');

/**
 * AdChain Offerwall View Component
 *
 * This component embeds the AdChain Offerwall WebView in a React Native container.
 * It can be used in tabs, modals, or any other container.
 *
 * @example
 * ```tsx
 * <AdchainOfferwallView
 *   placementId="main_tab_offerwall"
 *   style={{ flex: 1 }}
 *   onOfferwallOpened={() => console.log('Offerwall opened')}
 *   onOfferwallError={(error) => console.error('Error:', error)}
 *   onRewardEarned={(amount) => console.log('Earned:', amount)}
 * />
 * ```
 */
export const AdchainOfferwallView = React.forwardRef<any, AdchainOfferwallViewProps>((
  {
    placementId,
    style,
    onOfferwallOpened,
    onOfferwallClosed,
    onOfferwallError,
    onRewardEarned,
    onCustomEvent,
    onDataRequest,
  },
  ref
) => {
  const viewRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const insets = useSafeAreaInsets();

  const checkLoginStatus = useCallback(async () => {
    try {
      const loggedIn = await AdchainSdk.isLoggedIn();
      setIsLoggedIn(loggedIn);
    } catch (error) {
      console.error('Failed to check login status:', error);
      setIsLoggedIn(false);
    }
  }, []);

  // 탭이 포커스될 때마다 로그인 상태 확인 (로그인 후 화면 갱신 지원)
  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [checkLoginStatus])
  );

  // Merge external ref with internal ref
  React.useImperativeHandle(ref, () => viewRef.current);

  // Note: For Android, placementId is now handled via @ReactProp in the native ViewManager
  // iOS uses the property directly. No manual command dispatch needed.

  // Handle native error events
  const handleOfferwallError = (event: OfferwallErrorEvent) => {
    if (onOfferwallError) {
      onOfferwallError(event.nativeEvent.error);
    }
  };

  // Handle native reward events
  const handleRewardEarned = (event: OfferwallRewardEvent) => {
    if (onRewardEarned) {
      onRewardEarned(event.nativeEvent.amount);
    }
  };

  // ===== NEW: Handle custom events from WebView =====
  const handleCustomEvent = (event: OfferwallCustomEvent) => {
    if (onCustomEvent) {
      onCustomEvent(event.nativeEvent.eventType, event.nativeEvent.payload);
    }
  };

  // ===== NEW: Handle data requests from WebView =====
  const handleDataRequest = (event: OfferwallDataRequestEvent) => {
    if (onDataRequest) {
      const { requestId, requestType, params } = event.nativeEvent;

      // Get data from parent app
      const responseData = onDataRequest(requestType, params);

      // Send response back to native (which will forward to WebView)
      if (responseData !== null && responseData !== undefined && viewRef.current) {
        const viewId = findNodeHandle(viewRef.current);
        if (viewId) {
          try {
            UIManager.dispatchViewManagerCommand(
              viewId,
              'sendDataResponse',
              [requestId, responseData]
            );
          } catch (error) {
            console.error('[OfferwallView] Failed to send data response:', error);
          }
        }
      }
    }
  };
  // 로그인 안 됨
  if (!isLoggedIn) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emojiIcon}>🔒</Text>
        <Text style={styles.loginMessage}>Adchain 로그인을 해주세요</Text>
        <Text style={styles.loginSubMessage}>
          Offerwall을 이용하려면{'\n'}
          로그인이 필요합니다
        </Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#fff' }}>
      <NativeOfferwallView
        ref={viewRef}
        style={StyleSheet.flatten([{ flex: 1 }, style])}
        placementId={placementId}
        onOfferwallOpened={onOfferwallOpened}
        onOfferwallClosed={onOfferwallClosed}
        onOfferwallError={handleOfferwallError}
        onRewardEarned={handleRewardEarned}
        onCustomEvent={handleCustomEvent}
        onDataRequest={handleDataRequest}
      />
    </View>
  );
});
const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  emojiIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  loginMessage: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginSubMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
});
export default AdchainOfferwallView;
