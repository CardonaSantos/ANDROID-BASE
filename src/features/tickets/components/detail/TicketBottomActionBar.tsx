import { CheckCircle2, PenLine, Send, Wrench } from "lucide-react-native";

import { View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StyleSheet } from "react-native-unistyles";

import { AppButton, AppGrid, AppStack } from "@/design-system";

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

  onRequestTechnicianSignature: () => void;

  onRequestClientSignature: () => void;
}

export function TicketBottomActionBar({
  status,
  isLoading = false,
  onRequestAction,
  onRequestClientSignature,
  onRequestTechnicianSignature,
}: TicketBottomActionBarProps) {
  const insets = useSafeAreaInsets();

  const lifecycleAction = getTicketLifecycleAction(status);

  const blockedLabel = getTicketBlockedActionLabel(status);

  return (
    <View style={styles.container}>
      <AppStack gap="sm">
        <AppGrid gap="sm" minItemWidth={150}>
          <AppButton
            size="md"
            variant="soft"
            tone="neutral"
            leadingIcon={PenLine}
            fullWidth
            disabled={isLoading}
            accessibilityLabel="Registrar firma del técnico"
            onPress={onRequestTechnicianSignature}
          >
            Firma técnico
          </AppButton>

          <AppButton
            size="md"
            variant="soft"
            tone="info"
            leadingIcon={PenLine}
            fullWidth
            disabled={isLoading}
            accessibilityLabel="Registrar firma del cliente"
            onPress={onRequestClientSignature}
          >
            Firma cliente
          </AppButton>
        </AppGrid>

        {lifecycleAction ? (
          <AppButton
            size="lg"
            variant={lifecycleAction === "review" ? "soft" : "solid"}
            tone={lifecycleAction === "review" ? "info" : "primary"}
            leadingIcon={lifecycleAction === "review" ? Send : Wrench}
            fullWidth
            loading={isLoading}
            disabled={isLoading}
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
          >
            {blockedLabel}
          </AppButton>
        )}
      </AppStack>
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
