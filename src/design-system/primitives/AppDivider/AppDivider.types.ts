import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  SemanticColorToken,
} from '../../contracts';
import type {
  SpacingToken,
} from '../../tokens';

export interface AppDividerProps {
  orientation?:
    | 'horizontal'
    | 'vertical';

  colorToken?: SemanticColorToken;

  insetStart?: SpacingToken;
  insetEnd?: SpacingToken;

  thickness?: number;

  style?: StyleProp<ViewStyle>;
  testID?: string;
}
