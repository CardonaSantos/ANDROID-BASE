import type {
  ValueChangeHandler,
} from '../../contracts';
import type {
  AppInputProps,
} from '../AppInput';

export interface AppPasswordInputProps
  extends Omit<
    AppInputProps,
    | 'secureTextEntry'
    | 'trailing'
  > {
  visible?: boolean;
  defaultVisible?: boolean;

  onVisibilityChange?:
    ValueChangeHandler<boolean>;

  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}
