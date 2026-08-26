import type {
  ReactNode,
} from 'react';
import type {
  AccessibilityRole,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentSize,
} from '../../contracts';

export interface AppListItemProps {
  title: ReactNode;

  description?: ReactNode;
  metadata?: ReactNode;

  leading?: ReactNode;
  trailing?: ReactNode;

  disclosure?: boolean;

  size?: ComponentSize;

  selected?: boolean;
  disabled?: boolean;

  onPress?: (
    event: GestureResponderEvent,
  ) => void;

  onLongPress?: (
    event: GestureResponderEvent,
  ) => void;

  accessibilityRole?:
    AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;

  style?: StyleProp<ViewStyle>;
  contentStyle?:
    StyleProp<ViewStyle>;

  testID?: string;
}
