import type {
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import type {
  AppContainerGutter,
  AppContainerWidth,
} from './AppContainer';
import type { SpacingToken } from '../tokens';

export type ScreenBackground =
  | 'background'
  | 'surface'
  | 'surfaceSecondary';

export interface AppScreenLayoutProps {
  safeAreaEdges?: Edge[];
  background?: ScreenBackground;

  contained?: boolean;
  maxWidth?: AppContainerWidth;
  gutter?: AppContainerGutter;

  contentPaddingVertical?: SpacingToken;

  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}
