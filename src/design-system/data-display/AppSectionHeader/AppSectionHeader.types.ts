import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentSize,
} from '../../contracts';

export interface AppSectionHeaderProps {
  title: ReactNode;

  description?: ReactNode;

  leading?: ReactNode;
  action?: ReactNode;

  size?: ComponentSize;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
