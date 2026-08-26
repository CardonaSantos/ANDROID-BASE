import type {
  AppStateViewProps,
} from '../AppStateView';

export interface AppPermissionStateProps
  extends Omit<
    AppStateViewProps,
    | 'tone'
    | 'icon'
    | 'title'
    | 'description'
  > {
  title?: AppStateViewProps['title'];
  description?: AppStateViewProps['description'];
}
