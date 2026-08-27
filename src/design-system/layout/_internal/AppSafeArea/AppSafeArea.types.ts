import type { ReactNode } from "react";

import type { StyleProp, ViewProps, ViewStyle } from "react-native";

import type { AppSafeAreaEdge, ScreenBackground } from "../../screen.types";

export interface AppSafeAreaProps extends Omit<
  ViewProps,
  "children" | "style"
> {
  children?: ReactNode;

  edges?: readonly AppSafeAreaEdge[];

  background?: ScreenBackground;

  style?: StyleProp<ViewStyle>;
}
