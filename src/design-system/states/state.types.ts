import type {
  LucideIcon,
} from 'lucide-react-native';

import type {
  ComponentTone,
  VisualVariant,
} from '../contracts';

export interface AppStateAction {
  label: string;
  onPress: () => void;

  icon?: LucideIcon;

  tone?: ComponentTone;
  variant?: VisualVariant;

  accessibilityLabel?: string;

  loading?: boolean;
  disabled?: boolean;
}
