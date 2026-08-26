import type {
  AppStateViewProps,
} from '../AppStateView';

export interface AppErrorStateProps
  extends Omit<
    AppStateViewProps,
    | 'tone'
    | 'icon'
    | 'title'
    | 'announcementPriority'
  > {
  title?: AppStateViewProps['title'];
}
