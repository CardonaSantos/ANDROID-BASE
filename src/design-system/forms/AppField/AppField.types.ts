import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  AppFieldPresentationProps,
} from '../form.types';

export interface AppFieldProps
  extends AppFieldPresentationProps {
  children: ReactNode;

  counter?: ReactNode;

  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;

  testID?: string;
}
