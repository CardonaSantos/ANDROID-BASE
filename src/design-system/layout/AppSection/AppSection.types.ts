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

export interface AppSectionProps
  extends Omit<
    ViewProps,
    'children' | 'style'
  > {
  children?: ReactNode;
  header?: ReactNode;

  gap?: SpacingToken;

  style?: StyleProp<ViewStyle>;
}
