import type {
  ImageProps,
} from 'expo-image';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ValueChangeHandler,
} from '../../contracts';
import type {
  RadiusToken,
} from '../../tokens';

export interface AppImageGalleryItem {
  id: string;

  source:
    ImageProps['source'];

  placeholder?:
    ImageProps['placeholder'];

  accessibilityLabel?: string;

  recyclingKey?: string;
}

export interface AppImageGalleryProps {
  items:
    readonly AppImageGalleryItem[];

  index?: number;
  defaultIndex?: number;

  onIndexChange?:
    ValueChangeHandler<number>;

  aspectRatio?: number;
  height?: number;

  contentFit?:
    ImageProps['contentFit'];

  cachePolicy?:
    ImageProps['cachePolicy'];

  radius?: RadiusToken;

  showIndicators?: boolean;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;

  testID?: string;
}
