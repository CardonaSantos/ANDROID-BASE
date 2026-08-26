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

export interface AppCheckboxProps {
  value?: boolean;
  defaultValue?: boolean;

  onValueChange?:
    ValueChangeHandler<boolean>;

  indeterminate?: boolean;

  label?: ReactNode;
  description?: ReactNode;

  disabled?: boolean;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
