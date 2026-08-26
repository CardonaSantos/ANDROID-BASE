import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import type {
  SpacingToken,
} from '../../tokens';

export interface AppStackProps
  extends Omit<
    ViewProps,
    'children' | 'style'
  > {
  children?: ReactNode;

  gap?: SpacingToken;

  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];

  flex?: boolean | number;

  style?: StyleProp<ViewStyle>;
}
