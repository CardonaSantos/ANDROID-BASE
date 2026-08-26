import {
  FlashList,
} from '@shopify/flash-list';

import {
  AppRefreshControl,
} from '../AppRefreshControl';

import type {
  AppListProps,
} from './AppList.types';

export const AppList = <
  TItem,
>({
  ref,
  data,
  renderItem,
  keyExtractor,
  refreshing = false,
  onRefresh,
  refreshTitle,
  ...rest
}: AppListProps<TItem>) => (
  <FlashList<TItem>
    ref={ref}
    data={data}
    renderItem={renderItem}
    keyExtractor={
      keyExtractor
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
