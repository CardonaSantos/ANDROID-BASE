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

export type AppSwitchSize =
  | 'sm'
  | 'md';

export interface AppSwitchProps {
  value?: boolean;
  defaultValue?: boolean;

  onValueChange?:
    ValueChangeHandler<boolean>;

  label?: ReactNode;
  description?: ReactNode;

  size?: AppSwitchSize;
  disabled?: boolean;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
