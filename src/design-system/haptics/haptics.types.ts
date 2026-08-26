export type HapticFeedback =
  | 'none'
  | 'selection'
  | 'selectionFrequent'
  | 'press'
  | 'pressStrong'
  | 'toggleOn'
  | 'toggleOff'
  | 'longPress'
  | 'success'
  | 'warning'
  | 'error';

export interface HapticsPreferences {
  enabled: boolean;

  /**
   * Browser haptics are disabled by default because desktop browsers commonly
   * lack vibration hardware and support is inconsistent. It can be enabled
   * later for a mobile-web experience.
   */
  webEnabled: boolean;
}
