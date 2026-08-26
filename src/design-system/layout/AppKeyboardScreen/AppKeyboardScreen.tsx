import {
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import { AppContainer } from '../AppContainer';
import { DEFAULT_SCREEN_SAFE_AREA_EDGES } from '../screen.constants';

import type {
  AppKeyboardScreenHandle,
  AppKeyboardScreenProps,
} from './AppKeyboardScreen.types';

/**
 * Web/fallback implementation.
 *
 * Native builds resolve AppKeyboardScreen.native.tsx.
 */
export const AppKeyboardScreen =
  forwardRef<
    AppKeyboardScreenHandle,
    AppKeyboardScreenProps
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
        scrollStyle,
        scrollContentStyle,
        keyboardShouldPersistTaps = 'handled',
        keyboardDismissMode = 'on-drag',
        bottomOffset: _bottomOffset,
        extraKeyboardSpace:
          _extraKeyboardSpace,
        keyboardAwareEnabled:
          _keyboardAwareEnabled,
        disableScrollOnKeyboardHide:
          _disableScrollOnKeyboardHide,
        ...rest
      },
      ref,
    ) => {
      useImperativeHandle(
        ref,
        () => ({
          assureFocusedInputVisible() {
            // Browser layout/virtual keyboard handling does not use the native
            // Keyboard Controller measurement pipeline.
          },
        }),
        [],
      );

      return (
        <SafeAreaView
          edges={safeAreaEdges}
          style={[
            styles.root(background),
            style,
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps={
              keyboardShouldPersistTaps
            }
            keyboardDismissMode={
              keyboardDismissMode
            }
            style={[
              styles.scroll,
              scrollStyle,
            ]}
            contentContainerStyle={[
              styles.scrollContent,
              scrollContentStyle,
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
          </ScrollView>
        </SafeAreaView>
      );
    },
  );

AppKeyboardScreen.displayName =
  'AppKeyboardScreen';

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

    scroll: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
    },

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
      flexGrow: 1,
      paddingVertical:
        theme.spacing[
          paddingVertical
        ],
    }),
  }),
);
