import type { LucideIcon } from 'lucide-react-native';

import type {
  ComponentTone,
} from '../../contracts';
import type {
  AppPressableProps,
} from '../../primitives/AppPressable';

export type AppFabSize =
  | 'md'
  | 'lg';

export type AppFabPlacement =
  | 'inline'
  | 'bottomEnd'
  | 'bottomStart';

export interface AppFabProps
  extends Omit<
    AppPressableProps,
    | 'children'
    | 'style'
    | 'radius'
    | 'stateLayerColorToken'
    | 'touchTarget'
    | 'hitSlopPreset'
    | 'accessibilityLabel'
  > {
  icon: LucideIcon;
  accessibilityLabel: string;

  label?: string;

  tone?: ComponentTone;
  size?: AppFabSize;

  placement?: AppFabPlacement;

  style?: AppPressableProps['style'];
}
