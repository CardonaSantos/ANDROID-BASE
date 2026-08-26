import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentSize,
  ValueChangeHandler,
} from '../../contracts';
import type {
  AppFieldPresentationProps,
  AppSelectOption,
  SelectValue,
} from '../form.types';

export interface AppSelectProps<
  TValue extends SelectValue,
> extends AppFieldPresentationProps {
  options:
    readonly AppSelectOption<TValue>[];

  value?: TValue | null;
  defaultValue?: TValue | null;

  onValueChange?:
    ValueChangeHandler<
      TValue | null
    >;

  placeholder?: string;

  size?: ComponentSize;
  disabled?: boolean;

  accessibilityLabel?: string;

  maxMenuHeight?: number;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
