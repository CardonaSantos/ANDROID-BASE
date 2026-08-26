import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ValueChangeHandler,
} from '../../contracts';
import type {
  AppBreakpoint,
} from '../../tokens';
import type {
  AppNavigationItem,
} from '../navigation.types';

export interface AppAdaptiveNavigationProps<
  TValue extends string,
> {
  children: ReactNode;

  items: readonly [
    AppNavigationItem<TValue>,
    ...AppNavigationItem<TValue>[],
  ];

  value?: TValue;
  defaultValue?: TValue;

  onValueChange?:
    ValueChangeHandler<TValue>;

  railFrom?: Exclude<
    AppBreakpoint,
    'compact'
  >;

  railHeader?: ReactNode;
  railFooter?: ReactNode;

  showLabels?: boolean;

  style?: StyleProp<ViewStyle>;
  contentStyle?:
    StyleProp<ViewStyle>;

  testID?: string;
}
