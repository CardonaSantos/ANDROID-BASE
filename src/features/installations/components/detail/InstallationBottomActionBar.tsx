import { CheckCircle2, PlayCircle } from "lucide-react-native";

import { View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StyleSheet } from "react-native-unistyles";

import {
  AppButton,
  AppGrid,
  AppStack,
  AppSurface,
  AppText,
} from "@/design-system";

import type { InstallationTechnicalActions } from "../../api/installations.contracts.api";

/*
 * =========================================================
 * MOBILE LIFECYCLE ACTIONS
 * =========================================================
 *
 * Android solamente soporta:
 *
 * - iniciar;
 * - completar.
 *
 * Aunque el contrato técnico del servidor también
 * contenga otras acciones, no forman parte de la UX
 * móvil.
 * =========================================================
 */

export type InstallationLifecycleAction = "start" | "complete";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationBottomActionBarProps {
  actions: InstallationTechnicalActions;

  isLoadingAction?: InstallationLifecycleAction | null;

  onRequestAction: (action: InstallationLifecycleAction) => void;
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function InstallationBottomActionBar({
  actions,
  isLoadingAction = null,
  onRequestAction,
}: InstallationBottomActionBarProps) {
  const insets = useSafeAreaInsets();

  const isBusy = isLoadingAction !== null;

  const canStart = actions.iniciar.habilitada;

  const canComplete = actions.completar.habilitada;

  const hasActions = canStart || canComplete;

  return (
    <View
      style={[
        styles.root,

        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <AppSurface
        variant="elevated"
        radius="lg"
        padding="md"
        elevation="high"
        style={styles.surface}
      >
        {hasActions ? (
          <AppGrid gap="sm" minItemWidth={160}>
            {canStart ? (
              <AppButton
                size="md"
                variant="solid"
                tone="primary"
                leadingIcon={PlayCircle}
                fullWidth
                loading={isLoadingAction === "start"}
                disabled={isBusy && isLoadingAction !== "start"}
                loadingAccessibilityLabel="Iniciando instalación"
                accessibilityLabel="Iniciar instalación"
                onPress={() => {
                  if (isBusy) {
                    return;
                  }

                  onRequestAction("start");
                }}
              >
                Iniciar
              </AppButton>
            ) : null}

            {canComplete ? (
              <AppButton
                size="md"
                variant="solid"
                tone="success"
                leadingIcon={CheckCircle2}
                fullWidth
                loading={isLoadingAction === "complete"}
                disabled={isBusy && isLoadingAction !== "complete"}
                loadingAccessibilityLabel="Preparando finalización"
                accessibilityLabel="Completar instalación"
                onPress={() => {
                  if (isBusy) {
                    return;
                  }

                  onRequestAction("complete");
                }}
              >
                Completar
              </AppButton>
            ) : null}
          </AppGrid>
        ) : (
          <AppStack gap="xs" align="center">
            <AppText variant="bodySmall" weight="semibold" align="center">
              Sin acciones disponibles
            </AppText>

            <AppText variant="bodySmall" tone="secondary" align="center">
              El servidor no habilita acciones de ciclo para esta instalación.
            </AppText>
          </AppStack>
        )}
      </AppSurface>
    </View>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles = StyleSheet.create((theme) => ({
  root: {
    flexShrink: 0,

    width: "100%",

    paddingTop: theme.spacing.sm,

    paddingHorizontal: theme.spacing.md,

    backgroundColor: theme.colors.background,
  },

  surface: {
    width: "100%",

    maxWidth: 760,

    alignSelf: "center",
  },
}));
