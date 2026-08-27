import {
  forwardRef,
  type ComponentRef,
} from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  AppContainer,
} from '../AppContainer';
import {
  DEFAULT_SCREEN_SAFE_AREA_EDGES,
} from '../screen.constants';

import type {
  AppScrollScreenProps,
} from './AppScrollScreen.types';

/**
 * Full-screen scrolling layout.
 *
 * Use this for normal screens whose content may become taller than the
 * viewport. The ScrollView remains the scrolling owner on native platforms.
 *
 * `minHeight: 0` is intentional on the flex chain: scroll containers need a
 * bounded parent and must be allowed to shrink below their content size.
 */
export const AppScrollScreen =
  forwardRef<
    ComponentRef<typeof ScrollView>,
    AppScrollScreenProps
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
        keyboardShouldPersistTaps =
          'handled',
        keyboardDismissMode =
          'on-drag',
        ...rest
      },
      ref,
    ) => (
      <SafeAreaView
        edges={safeAreaEdges}
        style={[
          styles.root(
            background,
          ),
          style,
        ]}
      >
        <ScrollView
          ref={ref}
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
    ),
  );

AppScrollScreen.displayName =
  'AppScrollScreen';

const styles = StyleSheet.create(
  (theme) => ({
    root: (
      background:
        | 'background'
        | 'surface'
        | 'surfaceSecondary',
    ) => ({
      flex: 1,
      minHeight: 0,
      width: '100%',
      backgroundColor:
        theme.colors[background],
    }),

    scroll: {
      flex: 1,
      minHeight: 0,
      width: '100%',
    },

    scrollContent: {
      flexGrow: 1,
      width: '100%',
    },

    content: (
      paddingVertical:
        keyof typeof theme.spacing,
    ) => ({
      flexGrow: 1,
      width: '100%',
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
      width: '100%',
      paddingVertical:
        theme.spacing[
          paddingVertical
        ],
    }),
  }),
);
