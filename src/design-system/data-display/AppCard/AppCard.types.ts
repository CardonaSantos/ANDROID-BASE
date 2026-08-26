import type {
  ReactNode,
} from 'react';
import type {
  AccessibilityRole,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentTone,
} from '../../contracts';
import type {
  AppSurfaceVariant,
} from '../../primitives/AppSurface';
import type {
  ElevationToken,
  RadiusToken,
  SpacingToken,
} from '../../tokens';

export interface AppCardProps {
  children?: ReactNode;

  variant?: AppSurfaceVariant;
  tone?: ComponentTone;

  radius?: RadiusToken;
  padding?: SpacingToken;
  elevation?: ElevationToken;

  selected?: boolean;
  disabled?: boolean;

  onPress?: (
    event: GestureResponderEvent,
  ) => void;

  onLongPress?: (
    event: GestureResponderEvent,
  ) => void;

  accessibilityRole?:
    AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;

  style?: StyleProp<ViewStyle>;
  contentStyle?:
    StyleProp<ViewStyle>;

  testID?: string;
}
