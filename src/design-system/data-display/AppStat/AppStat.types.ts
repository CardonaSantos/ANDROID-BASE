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

export type AppStatVariant =
  | 'plain'
  | 'outlined'
  | 'tonal';

export interface AppStatProps {
  label: ReactNode;
  value: ReactNode;

  description?: ReactNode;
  supporting?: ReactNode;

  icon?: LucideIcon;

  tone?: ComponentTone;
  variant?: AppStatVariant;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
