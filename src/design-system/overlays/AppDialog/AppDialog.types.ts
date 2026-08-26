import type {
  ReactNode,
} from 'react';
import type {
  LucideIcon,
} from 'lucide-react-native';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentTone,
  OpenChangeHandler,
} from '../../contracts';

export type AppDialogSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface AppDialogProps {
  open?: boolean;
  defaultOpen?: boolean;

  onOpenChange?:
    OpenChangeHandler;

  title?: ReactNode;
  description?: ReactNode;

  icon?: LucideIcon;

  children?: ReactNode;
  actions?: ReactNode;

  tone?: ComponentTone;
  size?: AppDialogSize;

  dismissable?: boolean;
  showCloseButton?: boolean;

  closeAccessibilityLabel?: string;

  scrollable?: boolean;

  style?: StyleProp<ViewStyle>;
  contentStyle?:
    StyleProp<ViewStyle>;

  testID?: string;
}
