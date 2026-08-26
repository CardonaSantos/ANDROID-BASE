import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type AppContainerWidth =
  | 'compact'
  | 'readable'
  | 'page'
  | 'none';

export type AppContainerGutter =
  | 'none'
  | 'standard';

export interface AppContainerProps
  extends Omit<
    ViewProps,
    'children' | 'style'
  > {
  children?: ReactNode;

  maxWidth?: AppContainerWidth;
  gutter?: AppContainerGutter;

  style?: StyleProp<ViewStyle>;
}
