import type {
  AppStateViewProps,
} from '../AppStateView';

export interface AppOfflineStateProps
  extends Omit<
    AppStateViewProps,
    | 'tone'
    | 'icon'
    | 'title'
    | 'description'
    | 'announcementPriority'
  > {
  title?: AppStateViewProps['title'];
  description?: AppStateViewProps['description'];
}
