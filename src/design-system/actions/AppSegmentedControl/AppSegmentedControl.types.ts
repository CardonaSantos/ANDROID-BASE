import type { LucideIcon } from 'lucide-react-native';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentSize,
  ComponentTone,
  ValueChangeHandler,
} from '../../contracts';

export interface AppSegmentedOption<
  TValue extends string,
> {
  value: TValue;
  label: string;
  icon?: LucideIcon;

  disabled?: boolean;
  accessibilityLabel?: string;
}

export type AppSegmentedControlStateProps<
  TValue extends string,
> =
  | {
      value: TValue;
      defaultValue?: never;
      onValueChange?:
        ValueChangeHandler<TValue>;
    }
  | {
      value?: never;
      defaultValue: TValue;
      onValueChange?:
        ValueChangeHandler<TValue>;
    };

export interface AppSegmentedControlBaseProps<
  TValue extends string,
> {
  options:
    readonly AppSegmentedOption<TValue>[];

  tone?: ComponentTone;
  size?: ComponentSize;
  variant?: 'tonal' | 'outlined';

  disabled?: boolean;
  fullWidth?: boolean;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export type AppSegmentedControlProps<
  TValue extends string,
> =
  AppSegmentedControlBaseProps<TValue> &
    AppSegmentedControlStateProps<TValue>;
