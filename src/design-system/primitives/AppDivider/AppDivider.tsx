import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type {
  SemanticColorToken,
} from '../../contracts';
import type {
  SpacingToken,
} from '../../tokens';

import type {
  AppDividerProps,
} from './AppDivider.types';

export const AppDivider = ({
  orientation = 'horizontal',
  colorToken = 'divider',
  insetStart = 'none',
  insetEnd = 'none',
  thickness = StyleSheet.hairlineWidth,
  style,
  testID,
}: AppDividerProps) => (
  <View
    accessible={false}
    testID={testID}
    style={[
      styles.divider(
        orientation,
        colorToken,
        insetStart,
        insetEnd,
        thickness,
      ),
      style,
    ]}
  />
);

const styles = StyleSheet.create(
  (theme) => ({
    divider: (
      orientation:
        | 'horizontal'
        | 'vertical',
      colorToken:
        SemanticColorToken,
      insetStart: SpacingToken,
      insetEnd: SpacingToken,
      thickness: number,
    ) =>
      orientation === 'horizontal'
        ? {
            height: thickness,
            alignSelf: 'stretch',
            marginLeft:
              theme.spacing[
                insetStart
              ],
            marginRight:
              theme.spacing[insetEnd],
            backgroundColor:
              theme.colors[
                colorToken
              ],
          }
        : {
            width: thickness,
            alignSelf: 'stretch',
            marginTop:
              theme.spacing[
                insetStart
              ],
            marginBottom:
              theme.spacing[insetEnd],
            backgroundColor:
              theme.colors[
                colorToken
              ],
          },
  }),
);
