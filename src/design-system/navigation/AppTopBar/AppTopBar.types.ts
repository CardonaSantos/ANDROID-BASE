import type {
  ReactNode,
} from 'react';
import type {
  AppBackFallbackRoute,
} from '../../actions';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';
import type {
  Edge,
} from 'react-native-safe-area-context';

export type AppTopBarVariant =
  | 'surface'
  | 'background'
  | 'transparent';

export type AppTopBarTitleAlignment =
  | 'start'
  | 'center';

export interface AppTopBarProps {
  title: ReactNode;

  subtitle?: ReactNode;

  leading?: ReactNode;
  actions?: ReactNode;

  back?: boolean;
  onBack?: () => void;
  fallbackHref?: AppBackFallbackRoute;

  variant?: AppTopBarVariant;
  titleAlignment?:
    AppTopBarTitleAlignment;

  safeAreaEdges?: Edge[];

  divider?: boolean;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
