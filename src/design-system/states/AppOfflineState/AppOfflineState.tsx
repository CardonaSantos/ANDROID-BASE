import {
  WifiOff,
} from 'lucide-react-native';

import {
  feedbackCopy,
} from '../../feedback-components';

import {
  AppStateView,
} from '../AppStateView';

import type {
  AppOfflineStateProps,
} from './AppOfflineState.types';

export const AppOfflineState = ({
  title =
    feedbackCopy.states.offline
      .title,
  description =
    feedbackCopy.states.offline
      .description,
  announceOnMount = true,
  ...rest
}: AppOfflineStateProps) => (
  <AppStateView
    icon={WifiOff}
    tone="warning"
    title={title}
    description={description}
    announceOnMount={
      announceOnMount
    }
    announcementPriority="assertive"
    {...rest}
  />
);
