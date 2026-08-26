import type { ReactNode } from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';
import type {
  ImageProps,
} from 'expo-image';

import type {
  RadiusToken,
} from '../../tokens';

export interface AppImageProps
  extends Omit<
    ImageProps,
    | 'style'
    | 'accessible'
    | 'accessibilityLabel'
    | 'alt'
    | 'transition'
  > {
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ViewStyle>;

  radius?: RadiusToken;
  aspectRatio?: number;

  decorative?: boolean;
  accessibilityLabel?: string;

  fallback?: ReactNode;

  transition?: ImageProps['transition'];
}
