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

export interface AppTimePickerProps
  extends AppFieldPresentationProps {
  value?: Date;
  defaultValue?: Date;

  onValueChange?:
    ValueChangeHandler<Date>;

  locale?: string;
  timeZoneName?: string;

  is24Hour?: boolean;

  disabled?: boolean;

  placeholder?: string;
  invalidWebValueMessage?: string;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
