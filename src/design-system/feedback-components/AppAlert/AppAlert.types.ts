import type {
  ReactNode,
} from 'react';
import type {
  LucideIcon,
} from 'lucide-react-native';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  NovaLiveRegion,
} from '../../accessibility';
import type {
  FeedbackTone,
} from '../../feedback';

export type AppAlertDensity =
  | 'default'
  | 'compact';

export interface AppAlertProps {
  title?: ReactNode;
  children?: ReactNode;

  icon?: LucideIcon | null;

  tone?: FeedbackTone;
  density?: AppAlertDensity;

  action?: ReactNode;

  onDismiss?: () => void;
  dismissAccessibilityLabel?: string;

  liveRegion?: NovaLiveRegion;
  announceOnMount?: boolean;
  announcement?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
