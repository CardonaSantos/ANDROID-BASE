import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react-native';

import type {
  ComponentSize,
  ComponentTone,
  VisualVariant,
} from '../../contracts';
import type {
  AppPressableProps,
} from '../../primitives/AppPressable';

export interface AppButtonProps
  extends Omit<
    AppPressableProps,
    | 'children'
    | 'style'
    | 'radius'
    | 'showStateLayer'
    | 'stateLayerColorToken'
    | 'touchTarget'
    | 'hitSlopPreset'
  > {
  children: ReactNode;

  variant?: VisualVariant;
  tone?: ComponentTone;
  size?: ComponentSize;

  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;

  fullWidth?: boolean;

  /**
   * Optional accessible name used only while the async state is busy.
   */
  loadingAccessibilityLabel?: string;

  style?: AppPressableProps['style'];
}
