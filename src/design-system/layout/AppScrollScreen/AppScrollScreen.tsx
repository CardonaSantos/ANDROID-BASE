import { forwardRef, type ComponentRef } from "react";

import { ScrollView, View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import { AppSafeArea } from "../_internal/AppSafeArea";

import { AppContainer } from "../AppContainer";

import { DEFAULT_SCREEN_SAFE_AREA_EDGES } from "../screen.constants";

import type { AppScrollScreenProps } from "./AppScrollScreen.types";

/**
 * Full-screen scrolling layout.
 *
 * Use this for regular screens whose
 * content can become taller than the
 * available viewport.
 *
 * AppSafeArea owns the viewport and
 * system insets. ScrollView owns
 * scrolling.
 *
 * `minHeight: 0` is intentional:
 * scroll containers need a bounded
 * flex parent and must be allowed to
 * shrink below their content size.
 */
export const AppScrollScreen = forwardRef<
  ComponentRef<typeof ScrollView>,
  AppScrollScreenProps
>(
  (
    {
      children,
      safeAreaEdges = DEFAULT_SCREEN_SAFE_AREA_EDGES,
      background = "background",
      contained = true,
      maxWidth = "page",
      gutter = "standard",
      contentPaddingVertical = "lg",
      style,
      contentStyle,
      scrollStyle,
      scrollContentStyle,
      keyboardShouldPersistTaps = "handled",
      keyboardDismissMode = "on-drag",
      ...rest
    },
    ref,
  ) => (
    <AppSafeArea edges={safeAreaEdges} background={background} style={style}>
      <ScrollView
        ref={ref}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={keyboardDismissMode}
        style={[styles.scroll, scrollStyle]}
        contentContainerStyle={[styles.scrollContent, scrollContentStyle]}
        {...rest}
      >
        {contained ? (
          <AppContainer
            maxWidth={maxWidth}
            gutter={gutter}
            style={[styles.content(contentPaddingVertical), contentStyle]}
          >
            {children}
          </AppContainer>
        ) : (
          <View
            style={[styles.uncontained(contentPaddingVertical), contentStyle]}
          >
            {children}
          </View>
        )}
      </ScrollView>
    </AppSafeArea>
  ),
);

AppScrollScreen.displayName = "AppScrollScreen";

const styles = StyleSheet.create((theme) => ({
  scroll: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    width: "100%",
  },

  content: (paddingVertical: keyof typeof theme.spacing) => ({
    flexGrow: 1,
    width: "100%",

    paddingVertical: theme.spacing[paddingVertical],
  }),

  uncontained: (paddingVertical: keyof typeof theme.spacing) => ({
    flexGrow: 1,
    width: "100%",

    paddingVertical: theme.spacing[paddingVertical],
  }),
}));
