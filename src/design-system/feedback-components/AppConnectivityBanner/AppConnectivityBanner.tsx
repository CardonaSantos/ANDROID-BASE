import {
  CloudUpload,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  ReduceMotion,
} from 'react-native-reanimated';

import {
  AppButton,
} from '../../actions';
import type {
  FeedbackTone,
} from '../../feedback';
import {
  motion,
} from '../../tokens';

import {
  AppAlert,
} from '../AppAlert';
import {
  feedbackCopy,
} from '../feedback.copy';

import type {
  AppConnectivityBannerProps,
  ConnectivityBannerStatus,
} from './AppConnectivityBanner.types';

const bannerEntering =
  FadeInDown
    .duration(
      motion.duration.normal,
    )
    .reduceMotion(
      ReduceMotion.System,
    );

const bannerExiting =
  FadeOutUp
    .duration(
      motion.duration.fast,
    )
    .reduceMotion(
      ReduceMotion.System,
    );

const statusTone: Record<
  ConnectivityBannerStatus,
  FeedbackTone
> = {
  online: 'neutral',
  offline: 'warning',
  syncing: 'info',
  pending: 'warning',
  reconnected: 'success',
};

const statusIcon = {
  online: Wifi,
  offline: WifiOff,
  syncing: RefreshCw,
  pending: CloudUpload,
  reconnected: Wifi,
} as const;

export const AppConnectivityBanner = ({
  status,
  pendingCount = 0,
  message,
  action,
  hiddenWhenOnline = true,
  announce = true,
  style,
  testID,
}: AppConnectivityBannerProps) => {
  if (
    status === 'online' &&
    hiddenWhenOnline
  ) {
    return null;
  }

  const resolvedMessage =
    message ??
    resolveConnectivityMessage(
      status,
      pendingCount,
    );

  return (
    <Animated.View
      entering={bannerEntering}
      exiting={bannerExiting}
      style={style}
      testID={testID}
    >
      <AppAlert
        density="compact"
        tone={
          statusTone[status]
        }
        icon={
          statusIcon[status]
        }
        title={
          resolvedMessage
        }
        liveRegion={
          status === 'offline'
            ? 'assertive'
            : 'polite'
        }
        announceOnMount={
          announce
        }
        announcement={
          resolvedMessage
        }
        action={
          action ? (
            <AppButton
              size="sm"
              variant="ghost"
              tone="neutral"
              disabled={
                action.disabled
              }
              loading={
                action.loading
              }
              accessibilityLabel={
                action
                  .accessibilityLabel ??
                action.label
              }
              onPress={() => {
                action.onPress();
              }}
            >
              {action.label}
            </AppButton>
          ) : undefined
        }
      />
    </Animated.View>
  );
};

const resolveConnectivityMessage = (
  status:
    ConnectivityBannerStatus,
  pendingCount: number,
): string => {
  switch (status) {
    case 'offline':
      return feedbackCopy
        .connectivity.offline;

    case 'syncing':
      return feedbackCopy
        .connectivity.syncing;

    case 'pending':
      return feedbackCopy
        .connectivity.pending(
          Math.max(
            0,
            pendingCount,
          ),
        );

    case 'reconnected':
      return feedbackCopy
        .connectivity.reconnected;

    case 'online':
    default:
      return feedbackCopy
        .connectivity.online;
  }
};
