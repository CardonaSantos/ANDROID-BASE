import type { StyleProp, ViewStyle } from "react-native";

import type { SpacingToken } from "../tokens";

import type { AppContainerGutter, AppContainerWidth } from "./AppContainer";

export type AppSafeAreaEdge = "top" | "right" | "bottom" | "left";

export type ScreenBackground = "background" | "surface" | "surfaceSecondary";

export interface AppScreenLayoutProps {
  safeAreaEdges?: readonly AppSafeAreaEdge[];

  background?: ScreenBackground;

  contained?: boolean;
  maxWidth?: AppContainerWidth;
  gutter?: AppContainerGutter;

  contentPaddingVertical?: SpacingToken;

  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}
