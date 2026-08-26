import type {
  LucideIcon,
} from 'lucide-react-native';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ValueChangeHandler,
} from '../../contracts';

export interface AppTabOption<
  TValue extends string,
> {
  value: TValue;
  label: string;

  icon?: LucideIcon;
  badge?: string | number;

  disabled?: boolean;

  accessibilityLabel?: string;
}

export type AppTabsVariant =
  | 'underline'
  | 'pill';

export interface AppTabsProps<
  TValue extends string,
> {
  options: readonly [
    AppTabOption<TValue>,
    ...AppTabOption<TValue>[],
  ];

  value?: TValue;
  defaultValue?: TValue;

  onValueChange?:
    ValueChangeHandler<TValue>;

  variant?: AppTabsVariant;

  scrollable?: boolean;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
