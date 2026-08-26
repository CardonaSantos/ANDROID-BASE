import type {
  ComponentRef,
} from 'react';
import type {
  RefreshControl,
  RefreshControlProps,
} from 'react-native';

export type AppRefreshControlRef =
  ComponentRef<typeof RefreshControl>;

export interface AppRefreshControlProps
  extends Omit<
    RefreshControlProps,
    'refreshing'
  > {
  refreshing: boolean;
}
