import type {
  AppStateViewProps,
} from '../AppStateView';

export interface AppEmptyStateProps
  extends Omit<
    AppStateViewProps,
    'tone' | 'icon' | 'title'
  > {
  title?: AppStateViewProps['title'];
}
