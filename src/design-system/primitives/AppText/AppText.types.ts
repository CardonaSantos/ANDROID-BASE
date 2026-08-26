import type { ReactNode } from 'react';
import type {
  StyleProp,
  TextProps,
  TextStyle,
} from 'react-native';

import type {
  ContentTone,
  SemanticColorToken,
} from '../../contracts';
import type {
  TypographyVariant,
} from '../../tokens';

export type AppFontWeight =
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold';

export interface AppTextProps
  extends Omit<
    TextProps,
    | 'children'
    | 'style'
    | 'allowFontScaling'
  > {
  children?: ReactNode;

  variant?: TypographyVariant;
  tone?: ContentTone;

  /**
   * Semantic escape hatch. Prefer `tone` in ordinary feature code.
   */
  colorToken?: SemanticColorToken;

  weight?: AppFontWeight;

  align?: TextStyle['textAlign'];

  style?: StyleProp<TextStyle>;

  allowFontScaling?: boolean;

  /**
   * Respect the iOS Bold Text preference by promoting the configured weight
   * one step. Disable only for exceptional typography such as brand marks.
   */
  respectBoldText?: boolean;
}
