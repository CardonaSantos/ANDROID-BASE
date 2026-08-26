import {
  TriangleAlert,
} from 'lucide-react-native';

import {
  feedbackCopy,
} from '../../feedback-components';

import {
  AppStateView,
} from '../AppStateView';

import type {
  AppErrorStateProps,
} from './AppErrorState.types';

export const AppErrorState = ({
  title =
    feedbackCopy.states.error
      .title,
  announceOnMount = true,
  ...rest
}: AppErrorStateProps) => (
  <AppStateView
    icon={TriangleAlert}
    tone="danger"
    title={title}
    announceOnMount={
      announceOnMount
    }
    announcementPriority="assertive"
    {...rest}
  />
);
