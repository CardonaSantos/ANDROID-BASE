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
  AccessibilityAnnouncementPriority,
} from '../../accessibility';
import type {
  ComponentTone,
} from '../../contracts';
import type {
  AppStateAction,
} from '../state.types';

export type AppStateAlignment =
  | 'center'
  | 'start';

export type AppStateDensity =
  | 'default'
  | 'compact';

export interface AppStateViewProps {
  title: ReactNode;

  description?: ReactNode;

  icon?: LucideIcon;
  illustration?: ReactNode;

  tone?: ComponentTone;

  align?: AppStateAlignment;
  density?: AppStateDensity;

  fill?: boolean;

  primaryAction?:
    AppStateAction;

  secondaryAction?:
    AppStateAction;

  actions?: ReactNode;

  announceOnMount?: boolean;
  announcement?: string;
  announcementPriority?:
    AccessibilityAnnouncementPriority;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
