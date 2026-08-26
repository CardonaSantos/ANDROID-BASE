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
  ComponentTone,
} from '../../contracts';

export type AppBadgeVariant =
  | 'solid'
  | 'soft'
  | 'outlined';

export type AppBadgeSize =
  | 'sm'
  | 'md';

export interface AppBadgeProps {
  children?: ReactNode;

  icon?: LucideIcon;

  tone?: ComponentTone;
  variant?: AppBadgeVariant;
  size?: AppBadgeSize;

  dot?: boolean;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
