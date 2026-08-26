import type {
  AppStateViewProps,
} from '../AppStateView';

export interface AppNoResultsStateProps
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
