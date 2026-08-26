import type {
  AppInputProps,
} from '../AppInput';

export interface AppTextAreaProps
  extends Omit<
    AppInputProps,
    | 'multiline'
    | 'trailing'
    | 'leading'
  > {
  minRows?: number;

  showCharacterCount?: boolean;
}
