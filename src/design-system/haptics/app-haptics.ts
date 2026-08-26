import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import type {
  HapticFeedback,
  HapticsPreferences,
} from './haptics.types';

let preferences: HapticsPreferences = {
  enabled: true,
  webEnabled: false,
};

const canRun = (): boolean => {
  if (!preferences.enabled) {
    return false;
  }

  if (Platform.OS === 'web' && !preferences.webEnabled) {
    return false;
  }

  return true;
};

const triggerAndroid = async (feedback: HapticFeedback): Promise<void> => {
  switch (feedback) {
    case 'selection':
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Segment_Tick,
      );
      return;

    case 'selectionFrequent':
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Segment_Frequent_Tick,
      );
      return;

    case 'press':
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Virtual_Key,
      );
      return;

    case 'pressStrong':
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Context_Click,
      );
      return;

    case 'toggleOn':
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Toggle_On,
      );
      return;

    case 'toggleOff':
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Toggle_Off,
      );
      return;

    case 'longPress':
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Long_Press,
      );
      return;

    case 'success':
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Confirm,
      );
      return;

    case 'error':
      await Haptics.performAndroidHapticsAsync(
        Haptics.AndroidHaptics.Reject,
      );
      return;

    case 'warning':
      // Android currently has no dedicated semantic "warning" haptic in the
      // AndroidHaptics enum. Use Expo's notification mapping for this case.
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning,
      );
      return;

    case 'none':
    default:
      return;
  }
};

const triggerIOSOrWeb = async (
  feedback: HapticFeedback,
): Promise<void> => {
  switch (feedback) {
    case 'selection':
    case 'selectionFrequent':
    case 'toggleOn':
    case 'toggleOff':
      await Haptics.selectionAsync();
      return;

    case 'press':
      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );
      return;

    case 'pressStrong':
    case 'longPress':
      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Medium,
      );
      return;

    case 'success':
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      );
      return;

    case 'warning':
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning,
      );
      return;

    case 'error':
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error,
      );
      return;

    case 'none':
    default:
      return;
  }
};

const triggerSafely = async (
  feedback: HapticFeedback,
): Promise<void> => {
  if (feedback === 'none' || !canRun()) {
    return;
  }

  try {
    if (Platform.OS === 'android') {
      await triggerAndroid(feedback);
      return;
    }

    await triggerIOSOrWeb(feedback);
  } catch {
    /**
     * Haptic feedback is an enhancement, never business logic.
     * A hardware/OS/browser haptic failure must never make a user action fail.
     */
  }
};

export const appHaptics = {
  configure(
    nextPreferences: Partial<HapticsPreferences>,
  ): void {
    preferences = {
      ...preferences,
      ...nextPreferences,
    };
  },

  getPreferences(): Readonly<HapticsPreferences> {
    return preferences;
  },

  trigger(feedback: HapticFeedback): Promise<void> {
    return triggerSafely(feedback);
  },

  selection(): Promise<void> {
    return triggerSafely('selection');
  },

  selectionFrequent(): Promise<void> {
    return triggerSafely('selectionFrequent');
  },

  press(): Promise<void> {
    return triggerSafely('press');
  },

  pressStrong(): Promise<void> {
    return triggerSafely('pressStrong');
  },

  toggle(enabled: boolean): Promise<void> {
    return triggerSafely(enabled ? 'toggleOn' : 'toggleOff');
  },

  longPress(): Promise<void> {
    return triggerSafely('longPress');
  },

  success(): Promise<void> {
    return triggerSafely('success');
  },

  warning(): Promise<void> {
    return triggerSafely('warning');
  },

  error(): Promise<void> {
    return triggerSafely('error');
  },
} as const;
