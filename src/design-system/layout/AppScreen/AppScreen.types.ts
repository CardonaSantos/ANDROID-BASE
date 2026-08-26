import type { ReactNode } from 'react';
import type {
  ViewProps,
} from 'react-native';

import type {
  AppScreenLayoutProps,
} from '../screen.types';

export interface AppScreenProps
  extends Omit<
      ViewProps,
      'children' | 'style'
    >,
    AppScreenLayoutProps {
  children?: ReactNode;
}
