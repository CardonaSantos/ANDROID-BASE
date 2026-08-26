import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

export interface AppCenterProps
  extends Omit<
    ViewProps,
    'children' | 'style'
  > {
  children?: ReactNode;

  axis?:
    | 'both'
    | 'horizontal'
    | 'vertical';

  fill?: boolean;

  style?: StyleProp<ViewStyle>;
}
