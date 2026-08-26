import {
  FlashList,
} from '@shopify/flash-list';

import {
  useResponsiveValue,
  type ResponsiveValues,
} from '../../hooks';

import {
  AppRefreshControl,
} from '../AppRefreshControl';

import type {
  AppGridListProps,
} from './AppGridList.types';

export const AppGridList = <
  TItem,
>({
  ref,
  data,
  renderItem,
  keyExtractor,
  columns = 2,
  masonry = false,
  optimizeItemArrangement,
  refreshing = false,
  onRefresh,
  refreshTitle,
  ...rest
}: AppGridListProps<TItem>) => {
  const columnValues:
    ResponsiveValues<number> =
      typeof columns ===
        'number'
        ? {
            compact:
              Math.max(
                1,
                Math.floor(
                  columns,
                ),
              ),
          }
        : columns;

  const resolvedColumns =
    Math.max(
      1,
      Math.floor(
        useResponsiveValue(
          columnValues,
        ),
      ),
    );

  return (
    <FlashList<TItem>
      key={
        `nova-grid-${resolvedColumns}-${masonry ? 'masonry' : 'grid'}`
      }
      ref={ref}
      data={data}
      renderItem={renderItem}
      keyExtractor={
        keyExtractor
      }
      horizontal={false}
      numColumns={
        resolvedColumns
      }
      masonry={masonry}
      optimizeItemArrangement={
        masonry
          ? optimizeItemArrangement
          : undefined
      }
      refreshControl={
        onRefresh ? (
          <AppRefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              onRefresh
            }
            title={
              refreshTitle
            }
          />
        ) : undefined
      }
      {...rest}
    />
  );
};
