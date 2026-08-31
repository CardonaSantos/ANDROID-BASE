import { useState } from "react";

import { View } from "react-native";

import { RefreshCw, Send, Wrench } from "lucide-react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppCard,
  AppConfirmDialog,
  AppErrorState,
  AppIconButton,
  AppScrollScreen,
  AppSnackbar,
  AppStack,
  AppStateView,
  AppText,
  AppTopBar,
} from "@/design-system";

import { useAssignedTicketDetailQuery } from "../hooks/tickets.hooks";

import {
  useSendAssignedTicketToReviewMutation,
  useStartAssignedTicketMutation,
} from "../hooks/tickets.mutations.hooks";

import type { TicketLifecycleAction } from "../tickets.helpers";

import { TicketContactSection } from "../components/detail/TicketContactSection";

import { TicketDescriptionSection } from "../components/detail/TicketDescriptionSection";

import { TicketHero } from "../components/detail/TicketHero";

import { TicketLocationSection } from "../components/detail/TicketLocationSection";

import { TicketMediaSection } from "../components/detail/TicketMediaSection";

import { TicketBottomActionBar } from "../components/detail/TicketBottomActionBar";

export interface TicketDetailScreenProps {
  ticketId: number;

  onBack: () => void;

  onCopyText: (value: string) => void | Promise<void>;
}

export function TicketDetailScreen({
  ticketId,
  onBack,
  onCopyText,
}: TicketDetailScreenProps) {
  const [pendingAction, setPendingAction] =
    useState<TicketLifecycleAction | null>(null);

  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "success" | "danger";
  } | null>(null);

  /*
   * =========================================================
   * QUERY
   * =========================================================
   */

  const hasValidTicketId = Number.isInteger(ticketId) && ticketId > 0;

  const ticketQuery = useAssignedTicketDetailQuery(ticketId);

  /*
   * =========================================================
   * MUTATIONS
   * =========================================================
   */

  const startMutation = useStartAssignedTicketMutation();

  const reviewMutation = useSendAssignedTicketToReviewMutation();

  const isMutating = startMutation.isPending || reviewMutation.isPending;

  /*
   * =========================================================
   * LIFECYCLE
   * =========================================================
   */

  const handleLifecycleConfirm = async () => {
    if (pendingAction === null) {
      return;
    }

    try {
      if (pendingAction === "review") {
        await reviewMutation.mutateAsync(ticketId);

        setFeedback({
          message: "Ticket enviado a revisión",
          tone: "success",
        });

        return;
      }

      await startMutation.mutateAsync(ticketId);

      setFeedback({
        message: "Ticket tomado en proceso",
        tone: "success",
      });
    } catch (error) {
      setFeedback({
        message: "No se pudo actualizar el ticket.",
        tone: "danger",
      });

      /*
       * AppConfirmDialog mantiene abierto
       * el diálogo cuando onConfirm falla.
       */
      throw error;
    }
  };

  const confirmTitle =
    pendingAction === "review"
      ? "Enviar ticket a revisión"
      : "Tomar ticket en proceso";

  const confirmDescription =
    pendingAction === "review"
      ? "El ticket pasará a PENDIENTE_REVISION. Verifica que la evidencia y las observaciones estén completas."
      : "El ticket pasará a EN_PROCESO y quedará registrado como iniciado.";

  const confirmLabel =
    pendingAction === "review" ? "Enviar a revisión" : "Tomar en proceso";

  /*
   * =========================================================
   * INVALID ID
   * =========================================================
   */

  if (!hasValidTicketId) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Detalle del ticket"
          subtitle="Gestión técnica"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="Ticket inválido"
            description="El identificador del ticket no es válido."
            primaryAction={{
              label: "Volver a tickets",
              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  /*
   * =========================================================
   * INITIAL LOADING
   * =========================================================
   */

  if (ticketQuery.isPending) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Ticket #${ticketId}`}
          subtitle="Gestión técnica"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppStateView
            fill
            tone="primary"
            title="Cargando ticket"
            description="Consultando la información técnica del ticket."
            announceOnMount
          />
        </View>
      </View>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (ticketQuery.isError) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Ticket #${ticketId}`}
          subtitle="Gestión técnica"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="No se pudo cargar el ticket"
            description="Revisa tu conexión o intenta consultar nuevamente."
            primaryAction={{
              label: "Reintentar",
              icon: RefreshCw,
              loading: ticketQuery.isFetching,
              onPress: () => {
                void ticketQuery.refetch();
              },
            }}
            secondaryAction={{
              label: "Volver",
              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  const ticket = ticketQuery.data;

  /*
   * =========================================================
   * EMPTY / NOT FOUND
   * =========================================================
   */

  if (!ticket) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Ticket #${ticketId}`}
          subtitle="Gestión técnica"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="Ticket no disponible"
            description="No fue posible obtener la información del ticket solicitado."
            primaryAction={{
              label: "Volver a tickets",
              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  /*
   * =========================================================
   * CONTENT
   * =========================================================
   */

  return (
    <View style={styles.root}>
      {/* ===================================================
          LOCAL TOOLBAR
         =================================================== */}

      <AppTopBar
        title={`Ticket #${ticket.id}`}
        subtitle=""
        back
        onBack={onBack}
        safeAreaEdges={[]}
        variant="background"
        divider
        actions={
          <AppIconButton
            icon={RefreshCw}
            size="sm"
            variant="ghost"
            tone="neutral"
            accessibilityLabel="Actualizar detalle del ticket"
            loadingAccessibilityLabel="Actualizando detalle del ticket"
            loading={ticketQuery.isFetching}
            onPress={() => {
              void ticketQuery.refetch();
            }}
          />
        }
      />

      {/* ===================================================
          SCROLLABLE CONTENT
         =================================================== */}

      <AppScrollScreen
        safeAreaEdges={[]}
        contentPaddingVertical="md"
        scrollStyle={styles.scroll}
        scrollContentStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppStack gap="md">
          <TicketHero ticket={ticket} />

          <TicketContactSection ticket={ticket} onCopyText={onCopyText} />

          <TicketLocationSection ticket={ticket} onCopyText={onCopyText} />

          <TicketDescriptionSection ticket={ticket} />

          <TicketMediaSection medias={ticket.medias} />
        </AppStack>
      </AppScrollScreen>

      {/* ===================================================
          PERSISTENT ACTION
         =================================================== */}

      <TicketBottomActionBar
        status={ticket.estado}
        isLoading={isMutating}
        onRequestAction={(action) => {
          setPendingAction(action);
        }}
      />

      {/* ===================================================
          CONFIRMATION
         =================================================== */}

      <AppConfirmDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingAction(null);
          }
        }}
        title={confirmTitle}
        description={confirmDescription}
        icon={pendingAction === "review" ? Send : Wrench}
        tone="info"
        confirmTone="primary"
        confirmLabel={confirmLabel}
        cancelLabel="Cancelar"
        dismissable={!isMutating}
        onConfirm={handleLifecycleConfirm}
      >
        <AppCard variant="tonal" radius="md" padding="sm">
          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary">
              {`Ticket #${ticket.id}`}
            </AppText>

            <AppText variant="bodyMedium" weight="semibold" numberOfLines={2}>
              {ticket.titulo || "Ticket sin título"}
            </AppText>
          </AppStack>
        </AppCard>
      </AppConfirmDialog>

      {/* ===================================================
          FEEDBACK
         =================================================== */}

      <AppSnackbar
        open={feedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFeedback(null);
          }
        }}
        message={feedback?.message ?? ""}
        tone={feedback?.tone ?? "success"}
        position="bottom"
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,

    minHeight: 0,

    width: "100%",

    backgroundColor: theme.colors.background,
  },

  stateContainer: {
    flex: 1,

    minHeight: 0,
  },

  scroll: {
    flex: 1,

    minHeight: 0,
  },

  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
}));
