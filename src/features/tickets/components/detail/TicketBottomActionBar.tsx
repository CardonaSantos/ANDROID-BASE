import { CheckCircle2, Send, Wrench } from "lucide-react-native";

import { View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StyleSheet } from "react-native-unistyles";

import { AppButton, AppSurface } from "@/design-system";

import type { TicketStatus } from "../../api/tickets.contracts.api";

import {
  getTicketBlockedActionLabel,
  getTicketLifecycleAction,
  type TicketLifecycleAction,
} from "../../tickets.helpers";

export interface TicketBottomActionBarProps {
  status: TicketStatus;

  isLoading?: boolean;

  onRequestAction: (action: TicketLifecycleAction) => void;
}

export function TicketBottomActionBar({
  status,
  isLoading = false,
  onRequestAction,
}: TicketBottomActionBarProps) {
  const insets = useSafeAreaInsets();

  const lifecycleAction = getTicketLifecycleAction(status);

  const blockedLabel = getTicketBlockedActionLabel(status);

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
        {lifecycleAction ? (
          <AppButton
            size="lg"
            variant={lifecycleAction === "review" ? "soft" : "solid"}
            tone={lifecycleAction === "review" ? "info" : "primary"}
            leadingIcon={lifecycleAction === "review" ? Send : Wrench}
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            loadingAccessibilityLabel={
              lifecycleAction === "review"
                ? "Enviando ticket a revisión"
                : "Tomando ticket en proceso"
            }
            accessibilityLabel={
              lifecycleAction === "review"
                ? "Enviar ticket a revisión"
                : "Tomar ticket en proceso"
            }
            onPress={() => {
              onRequestAction(lifecycleAction);
            }}
          >
            {lifecycleAction === "review"
              ? "Enviar a revisión"
              : "Tomar ticket en proceso"}
          </AppButton>
        ) : (
          <AppButton
            size="lg"
            variant="soft"
            tone="neutral"
            leadingIcon={CheckCircle2}
            fullWidth
            disabled
            accessibilityLabel={blockedLabel}
          >
            {blockedLabel}
          </AppButton>
        )}
      </AppSurface>
    </View>
  );
}

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

    /*
     * En pantallas anchas evita que
     * el CTA se vuelva excesivamente
     * largo.
     */
    maxWidth: 760,

    borderWidth: 1,

    borderColor: theme.colors.border,
  },
}));
