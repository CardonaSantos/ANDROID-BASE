import { forwardRef, useImperativeHandle, useRef } from "react";

import { View } from "react-native";

import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller";

import { StyleSheet } from "react-native-unistyles";

import { spacing } from "../../tokens";

import { AppSafeArea } from "../_internal/AppSafeArea";

import { AppContainer } from "../AppContainer";

import { DEFAULT_SCREEN_SAFE_AREA_EDGES } from "../screen.constants";

import type {
  AppKeyboardScreenHandle,
  AppKeyboardScreenProps,
} from "./AppKeyboardScreen.types";

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
      bottomOffset = spacing["2xl"],
      extraKeyboardSpace = 0,
      keyboardAwareEnabled = true,
      disableScrollOnKeyboardHide = false,
      ...rest
    },
    ref,
  ) => {
    const nativeRef = useRef<KeyboardAwareScrollViewRef>(null);

    useImperativeHandle(
      ref,
      () => ({
        assureFocusedInputVisible() {
          nativeRef.current?.assureFocusedInputVisible();
        },
      }),
      [],
    );

    return (
      <AppSafeArea edges={safeAreaEdges} background={background} style={style}>
        <KeyboardAwareScrollView
          ref={nativeRef}
          bottomOffset={bottomOffset}
          extraKeyboardSpace={extraKeyboardSpace}
          enabled={keyboardAwareEnabled}
          disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
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
        </KeyboardAwareScrollView>
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
