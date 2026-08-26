import type {
  DimensionValue,
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  RadiusToken,
} from '../../tokens';

export type AppSkeletonVariant =
  | 'rect'
  | 'text'
  | 'circle';

export interface AppSkeletonProps {
  variant?: AppSkeletonVariant;

  width?: DimensionValue;
  height?: DimensionValue;

  radius?: RadiusToken;

  animate?: boolean;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
