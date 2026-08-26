import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentTone,
} from '../../contracts';

export type AppProgressVariant =
  | 'linear'
  | 'circular';

export type AppProgressSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface AppProgressProps {
  value: number;

  min?: number;
  max?: number;

  variant?: AppProgressVariant;
  size?: AppProgressSize;
  tone?: ComponentTone;

  showValue?: boolean;

  formatValue?: (
    value: number,
    min: number,
    max: number,
  ) => string;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
