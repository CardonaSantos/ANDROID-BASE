import { forwardRef, type ComponentRef } from "react";

import { View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import { AppSafeArea } from "../_internal/AppSafeArea";

import { AppContainer } from "../AppContainer";

import { DEFAULT_SCREEN_SAFE_AREA_EDGES } from "../screen.constants";

import type { AppScreenProps } from "./AppScreen.types";

export const AppScreen = forwardRef<ComponentRef<typeof View>, AppScreenProps>(
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
      ...rest
    },
    ref,
  ) => (
    <AppSafeArea
      ref={ref}
      edges={safeAreaEdges}
      background={background}
      style={style}
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
    </AppSafeArea>
  ),
);

AppScreen.displayName = "AppScreen";

const styles = StyleSheet.create((theme) => ({
  content: (paddingVertical: keyof typeof theme.spacing) => ({
    flexGrow: 1,
    width: "100%",

    paddingVertical: theme.spacing[paddingVertical],
  }),

  uncontained: (paddingVertical: keyof typeof theme.spacing) => ({
    flex: 1,
    width: "100%",

    paddingVertical: theme.spacing[paddingVertical],
  }),
}));
