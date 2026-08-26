import type {
  ReactNode,
} from 'react';
import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  ValueChangeHandler,
} from '../../contracts';

export interface AppCarouselProps<
  TItem,
> {
  items: readonly TItem[];

  keyExtractor: (
    item: TItem,
    index: number,
  ) => string;

  renderItem: (
    item: TItem,
    index: number,
  ) => ReactNode;

  index?: number;
  defaultIndex?: number;

  onIndexChange?:
    ValueChangeHandler<number>;

  aspectRatio?: number;
  height?: number;

  scrollEnabled?: boolean;

  showIndicators?: boolean;

  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  pageStyle?:
    StyleProp<ViewStyle>;

  testID?: string;
}
