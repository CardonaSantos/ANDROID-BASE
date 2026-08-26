import type {
  MaybePromise,
  ValueChangeHandler,
} from '../../contracts';
import type {
  AppInputProps,
} from '../AppInput';

export interface AppSearchInputProps
  extends Omit<
    AppInputProps,
    | 'value'
    | 'defaultValue'
    | 'onChangeText'
    | 'leading'
    | 'trailing'
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?:
    ValueChangeHandler<string>;

  onSearch?: (
    query: string,
  ) => MaybePromise<void>;

  debounceMs?: number;
  minimumLength?: number;
  searchOnMount?: boolean;

  showClearButton?: boolean;

  clearAccessibilityLabel?: string;
}
