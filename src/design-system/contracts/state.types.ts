import type { ValueChangeHandler } from './handler.types';

export interface ControllableStateProps<T> {
  value?: T;
  defaultValue: T;
  onValueChange?: ValueChangeHandler<T>;
}
