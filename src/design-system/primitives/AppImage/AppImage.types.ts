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
  /**
   * Outer wrapper style.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Style passed directly to Expo Image.
   *
   * Derive it from Expo Image's public prop contract instead of reusing
   * ViewStyle: ImageStyle intentionally has a narrower shape (for example,
   * `overflow: "scroll"` is not valid for an image).
   */
  imageStyle?: ImageProps['style'];

  radius?: RadiusToken;
  aspectRatio?: number;

  decorative?: boolean;
  accessibilityLabel?: string;

  fallback?: ReactNode;

  transition?: ImageProps['transition'];
}
