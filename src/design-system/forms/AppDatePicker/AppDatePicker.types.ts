import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ValueChangeHandler,
} from '../../contracts';
import type {
  AppFieldPresentationProps,
} from '../form.types';

export interface AppDatePickerProps
  extends AppFieldPresentationProps {
  value?: Date;
  defaultValue?: Date;

  onValueChange?:
    ValueChangeHandler<Date>;

  minimumDate?: Date;
  maximumDate?: Date;

  locale?: string;
  timeZoneName?: string;

  disabled?: boolean;

  placeholder?: string;
  invalidWebValueMessage?: string;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
