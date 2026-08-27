import { forwardRef, useImperativeHandle } from "react";

import { ScrollView, View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import { AppSafeArea } from "../_internal/AppSafeArea";

import { AppContainer } from "../AppContainer";

import { DEFAULT_SCREEN_SAFE_AREA_EDGES } from "../screen.constants";

import type {
  AppKeyboardScreenHandle,
  AppKeyboardScreenProps,
} from "./AppKeyboardScreen.types";

/**
 * Web/fallback implementation.
 *
 * Native builds resolve
 * AppKeyboardScreen.native.tsx.
 *
 * Browser layout handles the virtual
 * keyboard independently from the
 * native Keyboard Controller pipeline.
 */
export const AppKeyboardScreen = forwardRef<
  AppKeyboardScreenHandle,
  AppKeyboardScreenProps
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
      bottomOffset: _bottomOffset,
      extraKeyboardSpace: _extraKeyboardSpace,
      keyboardAwareEnabled: _keyboardAwareEnabled,
      disableScrollOnKeyboardHide: _disableScrollOnKeyboardHide,
      ...rest
    },
    ref,
  ) => {
    useImperativeHandle(
      ref,
      () => ({
        assureFocusedInputVisible() {
          // Web intentionally does not
          // use the native keyboard
          // measurement pipeline.
        },
      }),
      [],
    );

    return (
      <AppSafeArea edges={safeAreaEdges} background={background} style={style}>
        <ScrollView
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
    );
  },
);

AppKeyboardScreen.displayName = "AppKeyboardScreen";

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
