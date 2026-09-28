import { CheckCircle2, Send, Wrench } from "lucide-react-native";

import { View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import { AppButton } from "@/design-system";

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
  const lifecycleAction = getTicketLifecycleAction(status);

  const blockedLabel = getTicketBlockedActionLabel(status);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexShrink: 0,

    paddingTop: theme.spacing.sm,

    paddingHorizontal: theme.spacing.md,

    paddingBottom: theme.spacing.sm,

    borderTopWidth: 1,

    borderTopColor: theme.colors.border,

    backgroundColor: theme.colors.background,
  },

  content: {
    width: "100%",

    maxWidth: 760,

    alignSelf: "center",
  },
}));
