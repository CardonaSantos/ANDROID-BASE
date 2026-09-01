import {
  CalendarClock,
  CheckCircle2,
  PlayCircle,
  XCircle,
} from "lucide-react-native";

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
 * ACTION TYPES
 * =========================================================
 *
 * Solo acciones del ciclo físico de instalación.
 *
 * subirEvidencia
 * revelarCredenciales
 * reintentarPrealta
 *
 * pertenecen a sus secciones técnicas específicas.
 * =========================================================
 */

export type InstallationLifecycleAction =
  | "start"
  | "reprogram"
  | "complete"
  | "cancel";

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

  /*
   * =======================================================
   * SERVER AUTHORITY
   * =======================================================
   *
   * No consultamos estado.
   * No inferimos máquina de estados.
   *
   * El servidor ya decidió qué está habilitado.
   * =======================================================
   */

  const canStart = actions.iniciar.habilitada;

  const canReprogram = actions.reprogramar.habilitada;

  const canComplete = actions.completar.habilitada;

  const canCancel = actions.cancelar.habilitada;

  const hasLifecycleActions =
    canStart || canReprogram || canComplete || canCancel;

  const isBusy = isLoadingAction !== null;

  return (
    <View style={styles.container}>
      <AppSurface
        variant="elevated"
        radius="lg"
        padding="md"
        elevation="medium"
        style={[
          styles.surface,

          {
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <AppStack gap="sm">
          <AppText variant="bodySmall" tone="secondary" weight="medium">
            Acciones operativas
          </AppText>

          {hasLifecycleActions ? (
            <AppGrid gap="sm" minItemWidth={120}>
              {/* ===========================================
                  INICIAR
                 =========================================== */}

              {canStart ? (
                <AppButton
                  size="md"
                  variant="solid"
                  tone="primary"
                  leadingIcon={PlayCircle}
                  fullWidth
                  loading={isLoadingAction === "start"}
                  disabled={isBusy}
                  loadingAccessibilityLabel="Iniciando instalación"
                  accessibilityLabel="Iniciar trabajo de instalación"
                  onPress={() => {
                    onRequestAction("start");
                  }}
                >
                  Iniciar
                </AppButton>
              ) : null}

              {/* ===========================================
                  COMPLETAR
                 =========================================== */}

              {canComplete ? (
                <AppButton
                  size="md"
                  variant="solid"
                  tone="success"
                  leadingIcon={CheckCircle2}
                  fullWidth
                  loading={isLoadingAction === "complete"}
                  disabled={isBusy}
                  loadingAccessibilityLabel="Completando instalación"
                  accessibilityLabel="Completar instalación"
                  onPress={() => {
                    onRequestAction("complete");
                  }}
                >
                  Completar
                </AppButton>
              ) : null}

              {/* ===========================================
                  REPROGRAMAR
                 =========================================== */}

              {canReprogram ? (
                <AppButton
                  size="md"
                  variant="outlined"
                  tone="warning"
                  leadingIcon={CalendarClock}
                  fullWidth
                  loading={isLoadingAction === "reprogram"}
                  disabled={isBusy}
                  loadingAccessibilityLabel="Reprogramando instalación"
                  accessibilityLabel="Reprogramar instalación"
                  onPress={() => {
                    onRequestAction("reprogram");
                  }}
                >
                  Reprogramar
                </AppButton>
              ) : null}

              {/* ===========================================
                  CANCELAR
                 =========================================== */}

              {canCancel ? (
                <AppButton
                  size="md"
                  variant="soft"
                  tone="danger"
                  leadingIcon={XCircle}
                  fullWidth
                  loading={isLoadingAction === "cancel"}
                  disabled={isBusy}
                  loadingAccessibilityLabel="Cancelando instalación"
                  accessibilityLabel="Cancelar instalación"
                  onPress={() => {
                    onRequestAction("cancel");
                  }}
                >
                  Cancelar
                </AppButton>
              ) : null}
            </AppGrid>
          ) : (
            <AppStack gap="xs">
              <AppButton
                size="md"
                variant="soft"
                tone="neutral"
                leadingIcon={CheckCircle2}
                fullWidth
                disabled
                accessibilityLabel="Sin acciones de ciclo disponibles"
              >
                Sin acciones de ciclo
              </AppButton>

              <AppText variant="bodySmall" tone="secondary" align="center">
                El servidor no habilita cambios de estado para esta instalación
                en este momento.
              </AppText>
            </AppStack>
          )}
        </AppStack>
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
  container: {
    flexShrink: 0,

    paddingTop: theme.spacing.sm,

    paddingHorizontal: theme.spacing.md,

    backgroundColor: theme.colors.background,
  },

  surface: {
    width: "100%",

    alignSelf: "center",

    maxWidth: 760,

    borderWidth: 1,

    borderColor: theme.colors.border,
  },
}));
