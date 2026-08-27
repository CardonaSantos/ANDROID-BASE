import { forwardRef, type ComponentRef } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { AppContainer } from "../AppContainer";
import { DEFAULT_SCREEN_SAFE_AREA_EDGES } from "../screen.constants";

import type { AppScrollScreenProps } from "./AppScrollScreen.types";

/**
 * Standard scrolling screen.
 *
 * The SafeAreaView owns the full-screen boundary.
 * ScrollView owns scrolling and keeps its platform-native sizing behavior.
 *
 * Do not force flex/flexGrow through the ScrollView content tree:
 * content height must remain intrinsic so the ScrollView can measure overflow.
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
    <SafeAreaView
      edges={safeAreaEdges}
      style={[styles.root(background), style]}
    >
      <ScrollView
        ref={ref}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={keyboardDismissMode}
        style={scrollStyle}
        contentContainerStyle={[
          styles.scrollContent(contentPaddingVertical),
          scrollContentStyle,
        ]}
        {...rest}
      >
        {contained ? (
          <AppContainer
            maxWidth={maxWidth}
            gutter={gutter}
            style={contentStyle}
          >
            {children}
          </AppContainer>
        ) : (
          <View style={[styles.uncontained, contentStyle]}>{children}</View>
        )}
      </ScrollView>
    </SafeAreaView>
  ),
);

AppScrollScreen.displayName = "AppScrollScreen";

const styles = StyleSheet.create((theme) => ({
  root: (background: "background" | "surface" | "surfaceSecondary") => ({
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors[background],
  }),

  scrollContent: (paddingVertical: keyof typeof theme.spacing) => ({
    width: "100%",
    paddingVertical: theme.spacing[paddingVertical],
  }),

  uncontained: {
    width: "100%",
  },
}));
