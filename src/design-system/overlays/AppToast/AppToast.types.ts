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
  FeedbackTone,
} from '../../feedback';
import type {
  OpenChangeHandler,
} from '../../contracts';
import type {
  OverlayDuration,
  OverlayPosition,
} from '../overlay.types';

export interface AppToastProps {
  open?: boolean;
  defaultOpen?: boolean;

  onOpenChange?:
    OpenChangeHandler;

  message: ReactNode;

  icon?: LucideIcon | null;

  tone?: FeedbackTone;
  position?: OverlayPosition;

  duration?: OverlayDuration;

  announceOnOpen?: boolean;
  hapticOnOpen?: boolean;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
