import type { ReactNode } from 'react';
import type {
  Href,
} from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';

import type {
  ComponentSize,
  ComponentTone,
} from '../../contracts';
import type {
  AppPressableProps,
} from '../../primitives/AppPressable';

export interface AppLinkButtonProps
  extends Omit<
    AppPressableProps,
    | 'children'
    | 'style'
    | 'accessibilityRole'
    | 'stateLayerColorToken'
    | 'radius'
  > {
  href: Href;
  replace?: boolean;

  children: ReactNode;

  tone?: ComponentTone;
  size?: ComponentSize;

  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;

  style?: AppPressableProps['style'];
}
