import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentSize,
  ComponentTone,
} from '../../contracts';

export type AppLoadingLayout =
  | 'inline'
  | 'block';

export interface AppLoadingProps {
  label?: ReactNode;

  size?: ComponentSize;
  tone?: ComponentTone;
  layout?: AppLoadingLayout;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
