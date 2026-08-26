import type { LucideIcon } from 'lucide-react-native';

import type {
  ComponentSize,
  ComponentTone,
  VisualVariant,
} from '../../contracts';
import type {
  AppPressableProps,
} from '../../primitives/AppPressable';

export interface AppIconButtonProps
  extends Omit<
    AppPressableProps,
    | 'children'
    | 'style'
    | 'radius'
    | 'showStateLayer'
    | 'stateLayerColorToken'
    | 'touchTarget'
    | 'hitSlopPreset'
    | 'accessibilityLabel'
  > {
  icon: LucideIcon;
  accessibilityLabel: string;

  variant?: VisualVariant;
  tone?: ComponentTone;
  size?: ComponentSize;

  loadingAccessibilityLabel?: string;

  style?: AppPressableProps['style'];
}
