import type {
  ReactNode,
} from 'react';
import type {
  LucideIcon,
} from 'lucide-react-native';

import type {
  ValueChangeHandler,
} from '../contracts';

export interface AppNavigationItem<
  TValue extends string,
> {
  value: TValue;
  label: string;

  icon: LucideIcon;
  selectedIcon?: LucideIcon;

  badge?: ReactNode;

  disabled?: boolean;

  accessibilityLabel?: string;
}

export interface AppNavigationStateProps<
  TValue extends string,
> {
  value?: TValue;
  defaultValue?: TValue;

  onValueChange?:
    ValueChangeHandler<TValue>;
}
