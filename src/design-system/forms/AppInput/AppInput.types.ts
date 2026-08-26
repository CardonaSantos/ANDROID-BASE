import type {
  ComponentRef,
} from 'react';
import type {
  StyleProp,
  TextInput,
  ViewStyle,
} from 'react-native';

import type {
  AppFieldPresentationProps,
} from '../form.types';
import type {
  AppInputBaseProps,
} from '../_internal/AppInputBase';

export type AppInputRef =
  ComponentRef<typeof TextInput>;

export interface AppInputProps
  extends Omit<
      AppInputBaseProps,
      'invalid'
    >,
    AppFieldPresentationProps {
  accessibilityLabel?: string;

  /**
   * Layout style for the complete field (label + control + supporting text).
   * Use `containerStyle` for the input shell and `inputStyle` for text.
   */
  fieldStyle?:
    StyleProp<ViewStyle>;
}
