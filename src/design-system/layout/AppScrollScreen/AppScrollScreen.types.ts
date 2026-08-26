import type { ReactNode } from 'react';
import type {
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  AppScreenLayoutProps,
} from '../screen.types';

export interface AppScrollScreenProps
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
}
