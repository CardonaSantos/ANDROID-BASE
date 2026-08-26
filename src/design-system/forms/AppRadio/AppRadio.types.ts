import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

export interface AppRadioProps {
  value: string;

  label?: ReactNode;
  description?: ReactNode;

  disabled?: boolean;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
