import {
  SearchX,
} from 'lucide-react-native';

import {
  feedbackCopy,
} from '../../feedback-components';

import {
  AppStateView,
} from '../AppStateView';

import type {
  AppNoResultsStateProps,
} from './AppNoResultsState.types';

export const AppNoResultsState = ({
  title =
    feedbackCopy.states.noResults
      .title,
  description =
    feedbackCopy.states.noResults
      .description,
  ...rest
}: AppNoResultsStateProps) => (
  <AppStateView
    icon={SearchX}
    tone="neutral"
    title={title}
    description={description}
    {...rest}
  />
);
