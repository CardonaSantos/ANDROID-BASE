import type {
  AccessibilityRole,
  AccessibilityState,
  AccessibilityValue,
} from 'react-native';

export interface AccessibilitySnapshot {
  ready: boolean;

  screenReaderEnabled: boolean;
  accessibilityServiceEnabled: boolean;

  reduceMotionEnabled: boolean;
  reduceTransparencyEnabled: boolean;

  highTextContrastEnabled: boolean;
  darkerSystemColorsEnabled: boolean;
  prefersIncreasedContrast: boolean;

  boldTextEnabled: boolean;
  invertColorsEnabled: boolean;
  grayscaleEnabled: boolean;

  prefersCrossFadeTransitions: boolean;
}

export type AccessibilityAnnouncementPriority =
  | 'polite'
  | 'assertive';

export interface AccessibilitySemanticStateInput {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | 'mixed';
  busy?: boolean;
  expanded?: boolean;
}

export interface AccessibilityRangeValueInput {
  min?: number;
  max?: number;
  now?: number;
  text?: string;
}

export interface AccessibleControlSemantics {
  role?: AccessibilityRole;
  label?: string;
  hint?: string;
  state?: AccessibilityState;
  value?: AccessibilityValue;
  language?: string;
}
