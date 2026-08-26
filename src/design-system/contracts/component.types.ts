import type { StyleProp, ViewStyle } from 'react-native';

import type { SemanticColors } from '../theme/theme.types';

export type ComponentSize = 'sm' | 'md' | 'lg';

export type ComponentTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type VisualVariant =
  | 'solid'
  | 'soft'
  | 'outlined'
  | 'ghost';

export type SemanticColorToken = keyof SemanticColors;

export type ContentTone =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'disabled'
  | 'inverse'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface TestableProps {
  testID?: string;
}

export interface StylableViewProps {
  style?: StyleProp<ViewStyle>;
}
