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
import type {
  SpacingToken,
} from '../../tokens';

export interface AppRadioGroupProps {
  value?: string | null;
  defaultValue?: string | null;

  onValueChange?:
    ValueChangeHandler<string>;

  children: ReactNode;

  disabled?: boolean;

  label?: ReactNode;
  description?: ReactNode;

  gap?: SpacingToken;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
