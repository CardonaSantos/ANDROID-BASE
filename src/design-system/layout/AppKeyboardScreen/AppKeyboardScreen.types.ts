import type { ReactNode } from 'react';
import type {
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  AppScreenLayoutProps,
} from '../screen.types';

export interface AppKeyboardScreenHandle {
  /**
   * Native: delegates to KeyboardAwareScrollView's precise focused-input
   * visibility reconciliation.
   * Web: no-op because browser layout handles virtual keyboard differently.
   */
  assureFocusedInputVisible(): void;
}

export interface AppKeyboardScreenProps
  extends Omit<
      ScrollViewProps,
      | 'children'
      | 'style'
      | 'contentContainerStyle'
    >,
    AppScreenLayoutProps {
  children?: ReactNode;

  scrollStyle?: ScrollViewProps['style'];
  scrollContentStyle?: StyleProp<ViewStyle>;

  bottomOffset?: number;
  extraKeyboardSpace?: number;
  keyboardAwareEnabled?: boolean;
  disableScrollOnKeyboardHide?: boolean;
}
