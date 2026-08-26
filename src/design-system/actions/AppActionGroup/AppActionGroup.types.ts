import type { ReactNode } from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  SpacingToken,
} from '../../tokens';

export type AppActionGroupOrientation =
  | 'auto'
  | 'horizontal'
  | 'vertical';

export type AppActionGroupAlign =
  | 'start'
  | 'center'
  | 'end'
  | 'stretch';

export interface AppActionGroupProps {
  children?: ReactNode;

  orientation?:
    AppActionGroupOrientation;

  align?: AppActionGroupAlign;

  gap?: SpacingToken;

  reverse?: boolean;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
