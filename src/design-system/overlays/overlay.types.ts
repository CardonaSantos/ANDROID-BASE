import type {
  ReactNode,
} from 'react';

import type {
  FeedbackDurationToken,
} from '../tokens';

export type OverlayDuration =
  | FeedbackDurationToken
  | number;

export type OverlayPosition =
  | 'top'
  | 'bottom';

export interface OverlayAction {
  label: string;
  onPress: () => void;

  accessibilityLabel?: string;

  disabled?: boolean;
  loading?: boolean;
}

export interface OverlayContent {
  title?: ReactNode;
  description?: ReactNode;
}
