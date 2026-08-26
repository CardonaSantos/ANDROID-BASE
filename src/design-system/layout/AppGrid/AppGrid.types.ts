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

export interface AppGridProps
  extends Omit<
    ViewProps,
    'children' | 'style'
  > {
  children?: ReactNode;

  gap?: SpacingToken;
  rowGap?: SpacingToken;
  columnGap?: SpacingToken;

  minItemWidth?: number;
  maxItemWidth?: number;

  alignItems?: ViewStyle['alignItems'];

  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}
