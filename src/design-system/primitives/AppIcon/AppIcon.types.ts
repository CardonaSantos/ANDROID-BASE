import type {
  LucideIcon,
  LucideProps,
} from 'lucide-react-native';

import type {
  ContentTone,
  SemanticColorToken,
} from '../../contracts';
import type { sizes } from '../../tokens';

export type AppIconSize =
  | keyof typeof sizes.icon
  | number;

export interface AppIconProps
  extends Omit<
    LucideProps,
    | 'color'
    | 'size'
    | 'accessibilityLabel'
    | 'accessible'
  > {
  icon: LucideIcon;

  size?: AppIconSize;

  tone?: ContentTone;

  /**
   * Semantic escape hatch for composed design-system components.
   */
  colorToken?: SemanticColorToken;

  decorative?: boolean;
  accessibilityLabel?: string;
}
