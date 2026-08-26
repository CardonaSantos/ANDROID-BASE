import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentTone,
  ValueChangeHandler,
} from '../../contracts';
import type {
  AppSurfaceVariant,
} from '../../primitives/AppSurface';

export interface AppAccordionProps {
  title: ReactNode;
  children: ReactNode;

  description?: ReactNode;
  leading?: ReactNode;

  expanded?: boolean;
  defaultExpanded?: boolean;

  onExpandedChange?:
    ValueChangeHandler<boolean>;

  disabled?: boolean;

  variant?: AppSurfaceVariant;
  tone?: ComponentTone;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  contentStyle?:
    StyleProp<ViewStyle>;

  testID?: string;
}
