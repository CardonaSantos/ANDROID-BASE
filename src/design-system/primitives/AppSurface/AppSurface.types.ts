import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import type {
  ComponentTone,
} from '../../contracts';
import type {
  ElevationToken,
  RadiusToken,
  SpacingToken,
} from '../../tokens';

export type AppSurfaceVariant =
  | 'flat'
  | 'outlined'
  | 'elevated'
  | 'tonal';

export interface AppSurfaceProps
  extends Omit<
    ViewProps,
    'children' | 'style'
  > {
  children?: ReactNode;

  variant?: AppSurfaceVariant;
  tone?: ComponentTone;

  radius?: RadiusToken;
  padding?: SpacingToken;
  elevation?: ElevationToken;

  style?: StyleProp<ViewStyle>;
}
