import type {
  ReactNode,
} from 'react';
import type {
  LucideIcon,
} from 'lucide-react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentTone,
  ValueChangeHandler,
} from '../../contracts';

export type AppChipVariant =
  | 'solid'
  | 'soft'
  | 'outlined';

export type AppChipSize =
  | 'sm'
  | 'md';

export interface AppChipProps {
  children: ReactNode;

  leadingIcon?: LucideIcon;

  tone?: ComponentTone;
  variant?: AppChipVariant;
  size?: AppChipSize;

  selected?: boolean;
  defaultSelected?: boolean;

  onSelectedChange?:
    ValueChangeHandler<boolean>;

  onPress?: (
    event: GestureResponderEvent,
  ) => void;

  onDismiss?: () => void;

  disabled?: boolean;

  accessibilityLabel?: string;
  dismissAccessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
