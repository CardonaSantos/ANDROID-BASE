import type { HapticFeedback } from '../haptics';
import type { FeedbackDurationToken } from '../tokens';

export type FeedbackTone =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type FeedbackMode =
  | 'silent'
  | 'visual'
  | 'haptic'
  | 'visual-haptic';

export interface FeedbackPolicy {
  mode: FeedbackMode;
  haptic: HapticFeedback;
  duration: FeedbackDurationToken;
}
