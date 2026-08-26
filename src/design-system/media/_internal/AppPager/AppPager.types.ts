import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface AppPagerHandle {
  setPage(
    index: number,
  ): void;

  setPageWithoutAnimation(
    index: number,
  ): void;
}

export interface AppPagerProps {
  children?: ReactNode;

  initialPage?: number;
  scrollEnabled?: boolean;

  onPageSelected?: (
    index: number,
  ) => void;

  style?: StyleProp<ViewStyle>;
  pageStyle?:
    StyleProp<ViewStyle>;

  testID?: string;
}
