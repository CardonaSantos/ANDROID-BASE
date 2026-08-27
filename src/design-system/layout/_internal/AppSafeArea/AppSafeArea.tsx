import { forwardRef, type ComponentRef } from "react";

import { View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import { DEFAULT_SCREEN_SAFE_AREA_EDGES } from "../../screen.constants";

import type { ScreenBackground } from "../../screen.types";

import type { AppSafeAreaProps } from "./AppSafeArea.types";

export const AppSafeArea = forwardRef<
  ComponentRef<typeof View>,
  AppSafeAreaProps
>(
  (
    {
      children,
      edges = DEFAULT_SCREEN_SAFE_AREA_EDGES,
      background = "background",
      style,
      ...rest
    },
    ref,
  ) => {
    const useTop = edges.includes("top");

    const useRight = edges.includes("right");

    const useBottom = edges.includes("bottom");

    const useLeft = edges.includes("left");

    return (
      <View
        ref={ref}
        {...rest}
        style={[
          style,
          styles.root(background, useTop, useRight, useBottom, useLeft),
        ]}
      >
        {children}
      </View>
    );
  },
);

AppSafeArea.displayName = "AppSafeArea";

const styles = StyleSheet.create((theme, rt) => ({
  root: (
    background: ScreenBackground,
    useTop: boolean,
    useRight: boolean,
    useBottom: boolean,
    useLeft: boolean,
  ) => ({
    flex: 1,
    minHeight: 0,
    width: "100%",

    backgroundColor: theme.colors[background],

    paddingTop: useTop ? rt.insets.top : 0,

    paddingRight: useRight ? rt.insets.right : 0,

    paddingBottom: useBottom ? rt.insets.bottom : 0,

    paddingLeft: useLeft ? rt.insets.left : 0,
  }),
}));
