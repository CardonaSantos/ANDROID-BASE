import {
  ShieldAlert,
} from 'lucide-react-native';

import {
  feedbackCopy,
} from '../../feedback-components';

import {
  AppStateView,
} from '../AppStateView';

import type {
  AppPermissionStateProps,
} from './AppPermissionState.types';

export const AppPermissionState = ({
  title =
    feedbackCopy.states.permission
      .title,
  description =
    feedbackCopy.states.permission
      .description,
  ...rest
}: AppPermissionStateProps) => (
  <AppStateView
    icon={ShieldAlert}
    tone="warning"
    title={title}
    description={description}
    {...rest}
  />
);
