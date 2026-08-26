import {
  forwardRef,
  type ComponentRef,
} from 'react';
import { View } from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { AppContainer } from '../AppContainer';
import { DEFAULT_SCREEN_SAFE_AREA_EDGES } from '../screen.constants';

import type {
  AppScreenProps,
} from './AppScreen.types';

export const AppScreen = forwardRef<
  ComponentRef<typeof SafeAreaView>,
  AppScreenProps
>(
  (
    {
      children,
      safeAreaEdges =
        DEFAULT_SCREEN_SAFE_AREA_EDGES,
      background = 'background',
      contained = true,
      maxWidth = 'page',
      gutter = 'standard',
      contentPaddingVertical = 'lg',
      style,
      contentStyle,
      ...rest
    },
    ref,
  ) => (
    <SafeAreaView
      ref={ref}
      edges={safeAreaEdges}
      style={[
        styles.root(background),
        style,
      ]}
      {...rest}
    >
      {contained ? (
        <AppContainer
          maxWidth={maxWidth}
          gutter={gutter}
          style={[
            styles.content(
              contentPaddingVertical,
            ),
            contentStyle,
          ]}
        >
          {children}
        </AppContainer>
      ) : (
        <View
          style={[
            styles.uncontained(
              contentPaddingVertical,
            ),
            contentStyle,
          ]}
        >
          {children}
        </View>
      )}
    </SafeAreaView>
  ),
);

AppScreen.displayName = 'AppScreen';

const styles = StyleSheet.create(
  (theme) => ({
    root: (
      background:
        | 'background'
        | 'surface'
        | 'surfaceSecondary',
    ) => ({
      flex: 1,
      backgroundColor:
        theme.colors[background],
    }),

    content: (
      paddingVertical:
        keyof typeof theme.spacing,
    ) => ({
      flexGrow: 1,
      paddingVertical:
        theme.spacing[
          paddingVertical
        ],
    }),

    uncontained: (
      paddingVertical:
        keyof typeof theme.spacing,
    ) => ({
      flex: 1,
      paddingVertical:
        theme.spacing[
          paddingVertical
        ],
    }),
  }),
);
