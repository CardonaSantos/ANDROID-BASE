import {
  Inbox,
} from 'lucide-react-native';

import {
  feedbackCopy,
} from '../../feedback-components';

import {
  AppStateView,
} from '../AppStateView';

import type {
  AppEmptyStateProps,
} from './AppEmptyState.types';

export const AppEmptyState = ({
  title =
    feedbackCopy.states.empty
      .title,
  ...rest
}: AppEmptyStateProps) => (
  <AppStateView
    icon={Inbox}
    tone="neutral"
    title={title}
    {...rest}
  />
);
