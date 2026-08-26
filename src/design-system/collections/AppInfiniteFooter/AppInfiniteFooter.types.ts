import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

export type AppInfiniteFooterState =
  | 'idle'
  | 'loading'
  | 'error'
  | 'end';

export interface AppInfiniteFooterProps {
  state:
    AppInfiniteFooterState;

  errorMessage?: ReactNode;
  endMessage?: ReactNode;

  retryLabel?: string;
  onRetry?: () => void;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
