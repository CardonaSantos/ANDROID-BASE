import type {
  StyleProp,
  ViewStyle,
} from 'react-native';
import type {
  Edge,
} from 'react-native-safe-area-context';

import type {
  AppNavigationItem,
  AppNavigationStateProps,
} from '../navigation.types';

export interface AppBottomNavigationProps<
  TValue extends string,
> extends AppNavigationStateProps<TValue> {
  items: readonly [
    AppNavigationItem<TValue>,
    ...AppNavigationItem<TValue>[],
  ];

  showLabels?: boolean;

  safeAreaEdges?: Edge[];

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
