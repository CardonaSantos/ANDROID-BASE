import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

export type ConnectivityBannerStatus =
  | 'online'
  | 'offline'
  | 'syncing'
  | 'pending'
  | 'reconnected';

export interface ConnectivityBannerAction {
  label: string;
  onPress: () => void;

  accessibilityLabel?: string;

  disabled?: boolean;
  loading?: boolean;
}

export interface AppConnectivityBannerProps {
  status:
    ConnectivityBannerStatus;

  pendingCount?: number;

  message?: string;

  action?:
    ConnectivityBannerAction;

  hiddenWhenOnline?: boolean;

  announce?: boolean;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
