import type {
  ReactNode,
} from 'react';

import type {
  ComponentSize,
} from '../contracts';

export interface AppFieldPresentationProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;

  required?: boolean;
  disabled?: boolean;

  size?: ComponentSize;
}

export type SelectValue =
  | string
  | number;

export interface AppSelectOption<
  TValue extends SelectValue,
> {
  value: TValue;
  label: string;
  description?: string;
  disabled?: boolean;
}
