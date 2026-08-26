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

export interface AppSliderProps
  extends AppFieldPresentationProps {
  value?: number;
  defaultValue?: number;

  onValueChange?:
    ValueChangeHandler<number>;

  min?: number;
  max?: number;
  step?: number;

  disabled?: boolean;

  showValue?: boolean;

  formatValue?: (
    value: number,
  ) => string;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
