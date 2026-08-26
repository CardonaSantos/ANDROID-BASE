import type {
  Ref,
} from 'react';
import type {
  FlashListProps,
  FlashListRef,
} from '@shopify/flash-list';

import type {
  ResponsiveValues,
} from '../../hooks';

export type AppGridColumns =
  | number
  | ResponsiveValues<number>;

export interface AppGridListProps<TItem>
  extends Omit<
    FlashListProps<TItem>,
    | 'data'
    | 'renderItem'
    | 'keyExtractor'
    | 'horizontal'
    | 'numColumns'
    | 'masonry'
    | 'optimizeItemArrangement'
    | 'refreshControl'
    | 'refreshing'
    | 'onRefresh'
  > {
  data:
    NonNullable<
      FlashListProps<TItem>[
        'data'
      ]
    >;

  renderItem:
    NonNullable<
      FlashListProps<TItem>[
        'renderItem'
      ]
    >;

  keyExtractor:
    NonNullable<
      FlashListProps<TItem>[
        'keyExtractor'
      ]
    >;

  ref?: Ref<
    FlashListRef<TItem>
  >;

  columns?:
    AppGridColumns;

  masonry?: boolean;

  optimizeItemArrangement?: boolean;

  refreshing?: boolean;
  onRefresh?: () => void;

  refreshTitle?: string;
}
