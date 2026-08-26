import type {
  Ref,
} from 'react';
import type {
  FlashListProps,
  FlashListRef,
} from '@shopify/flash-list';

export interface AppListProps<TItem>
  extends Omit<
    FlashListProps<TItem>,
    | 'data'
    | 'renderItem'
    | 'keyExtractor'
    | 'numColumns'
    | 'masonry'
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

  /**
   * Required by NOVA even though FlashList keeps it optional.
   * FlashList v2 strongly recommends stable keys to prevent layout glitches.
   */
  keyExtractor:
    NonNullable<
      FlashListProps<TItem>[
        'keyExtractor'
      ]
    >;

  ref?: Ref<
    FlashListRef<TItem>
  >;

  refreshing?: boolean;
  onRefresh?: () => void;

  refreshTitle?: string;
}
