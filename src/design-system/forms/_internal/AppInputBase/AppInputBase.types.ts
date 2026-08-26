import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type {
  ComponentSize,
} from '../../../contracts';

export interface AppInputBaseProps
  extends Omit<
    TextInputProps,
    'style'
  > {
  size?: ComponentSize;

  invalid?: boolean;
  readOnly?: boolean;

  leading?: ReactNode;
  trailing?: ReactNode;

  containerStyle?:
    StyleProp<ViewStyle>;

  inputStyle?:
    StyleProp<TextStyle>;
}
