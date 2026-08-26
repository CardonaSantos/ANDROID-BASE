import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  SpacingToken,
} from '../../tokens';

export interface AppSpacerProps {
  size?: SpacingToken;
  axis?:
    | 'horizontal'
    | 'vertical'
    | 'both';

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
