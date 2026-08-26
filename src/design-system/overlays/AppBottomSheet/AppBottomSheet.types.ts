import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  OpenChangeHandler,
} from '../../contracts';

export interface AppBottomSheetProps {
  open?: boolean;
  defaultOpen?: boolean;

  onOpenChange?:
    OpenChangeHandler;

  children: ReactNode;

  /**
   * Explicit snap points are non-empty when supplied.
   * Omit the prop to use v5 dynamic sizing.
   */
  snapPoints?: readonly [
    number | string,
    ...(number | string)[],
  ];

  initialIndex?: number;

  enableDynamicSizing?: boolean;
  maxDynamicContentSize?: number;

  enablePanDownToClose?: boolean;
  dismissOnBackdropPress?: boolean;

  onIndexChange?: (
    index: number,
  ) => void;

  contentStyle?:
    StyleProp<ViewStyle>;

  testID?: string;
}
