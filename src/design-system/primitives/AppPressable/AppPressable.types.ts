import type {
  ReactNode,
} from 'react';
import type {
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

import type {
  SemanticColorToken,
} from '../../contracts';
import type {
  HapticFeedback,
} from '../../haptics';
import type {
  InteractionIntensity,
} from '../../interaction';
import type {
  RadiusToken,
} from '../../tokens';

export type TouchTargetPreset =
  | 'minimum'
  | 'compact'
  | 'none';

export type HitSlopPreset =
  | 'none'
  | 'compact'
  | 'normal'
  | 'generous';

export interface AppPressableRenderState {
  pressed: boolean;
  hovered: boolean;
  focused: boolean;
  disabled: boolean;
}

export interface AppPressableProps
  extends Omit<
    PressableProps,
    | 'children'
    | 'style'
    | 'disabled'
  > {
  children:
    | ReactNode
    | ((
        state: AppPressableRenderState,
      ) => ReactNode);

  style?: StyleProp<ViewStyle>;

  disabled?: boolean;
  loading?: boolean;

  interaction?: InteractionIntensity;

  /**
   * Overrides the haptic from the selected interaction preset.
   * `false` explicitly disables physical feedback.
   */
  haptic?:
    | HapticFeedback
    | false;

  touchTarget?: TouchTargetPreset;
  hitSlopPreset?: HitSlopPreset;

  radius?: RadiusToken;

  showStateLayer?: boolean;
  stateLayerColorToken?: SemanticColorToken;

  showFocusRing?: boolean;
}
