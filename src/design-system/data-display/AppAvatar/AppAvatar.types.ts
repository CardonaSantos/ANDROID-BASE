import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ComponentTone,
} from '../../contracts';
import type {
  AppImageProps,
} from '../../primitives/AppImage';
import type {
  sizes,
} from '../../tokens';

export type AppAvatarSize =
  keyof typeof sizes.avatar;

export type AppAvatarShape =
  | 'circle'
  | 'rounded';

export interface AppAvatarProps {
  source?: AppImageProps['source'];
  placeholder?:
    AppImageProps['placeholder'];

  name?: string;

  fallback?: ReactNode;

  size?: AppAvatarSize;
  shape?: AppAvatarShape;
  tone?: ComponentTone;

  contentFit?:
    AppImageProps['contentFit'];
  cachePolicy?:
    AppImageProps['cachePolicy'];

  decorative?: boolean;
  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
