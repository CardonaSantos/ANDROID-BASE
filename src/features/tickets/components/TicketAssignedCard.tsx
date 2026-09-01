import {
  CalendarClock,
  CheckCircle2,
  Eye,
  ImageIcon,
  MapPin,
  Send,
  User,
  Wrench,
} from "lucide-react-native";
import { useState } from "react";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppConfirmDialog,
  AppGrid,
  AppIcon,
  AppInline,
  AppSnackbar,
  AppStack,
  AppText,
} from "@/design-system";

import type { TicketAssignedListItem } from "../api/tickets.contracts.api";

import {
  useSendAssignedTicketToReviewMutation,
  useStartAssignedTicketMutation,
} from "../hooks/tickets.mutations.hooks";

import {
  formatTicketDate,
  getTicketAddressText,
  getTicketBlockedActionLabel,
  getTicketLifecycleAction,
  type TicketLifecycleAction,
} from "../tickets.helpers";

import { TicketContactActions } from "./TicketContactActions";

import { TicketLocationActions } from "./TicketLocationActions";

import { TicketMediaStrip } from "./TicketMediaStrip";

import { TicketPriorityBadge } from "./TicketPriorityBadge";

import { TicketStatusBadge } from "./TicketStatusBadge";

export interface TicketAssignedCardProps {
  ticket: TicketAssignedListItem;

  onOpenDetails: (ticketId: number) => void;

  onCopyText: (value: string) => void | Promise<void>;
}

export function TicketAssignedCard({
  ticket,
  onOpenDetails,
  onCopyText,
}: TicketAssignedCardProps) {
  const [pendingAction, setPendingAction] =
    useState<TicketLifecycleAction | null>(null);

  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "success" | "danger";
  } | null>(null);

  const startMutation = useStartAssignedTicketMutation();

  const reviewMutation = useSendAssignedTicketToReviewMutation();

  const lifecycleAction = getTicketLifecycleAction(ticket.estado);

  const addressText = getTicketAddressText(ticket.direccion);

  const medias = ticket.medias ?? [];

  const isMutating = startMutation.isPending || reviewMutation.isPending;

  const handleLifecycleConfirm = async () => {
    if (pendingAction === null) {
      return;
    }

    try {
      if (pendingAction === "review") {
        await reviewMutation.mutateAsync(ticket.id);

        setFeedback({
          message: "Ticket enviado a revisión",
          tone: "success",
        });

        return;
      }

      await startMutation.mutateAsync(ticket.id);

      setFeedback({
        message: "Ticket tomado en proceso",
        tone: "success",
      });
    } catch {
      setFeedback({
        message: "No se pudo actualizar el ticket.",
        tone: "danger",
      });

      throw new Error("Ticket lifecycle update failed.");
    }
  };

  const confirmTitle =
    pendingAction === "review"
      ? "Enviar ticket a revisión"
      : "Tomar ticket en proceso";

  const confirmDescription =
    pendingAction === "review"
      ? `El ticket #${ticket.id} pasará a pendiente de revisión.`
      : `El ticket #${ticket.id} pasará a trabajo en proceso.`;

  const confirmLabel =
    pendingAction === "review" ? "Enviar a revisión" : "Confirmar inicio";

  return (
    <>
      <AppCard
        variant="outlined"
        radius="lg"
        padding="md"
        accessibilityLabel={`Ticket ${ticket.id}: ${
          ticket.titulo ?? "Sin título"
        }`}
      >
        <AppStack gap="md">
          {/* ==================================================
              ESTADO / PRIORIDAD / FECHA
             ================================================== */}

          <AppInline gap="sm" align="flex-start" justify="space-between">
            <AppInline gap="xs" align="center" wrap flex>
              <TicketStatusBadge status={ticket.estado} />

              <TicketPriorityBadge priority={ticket.prioridad} />

              {medias.length > 0 ? (
                <AppBadge
                  icon={ImageIcon}
                  size="sm"
                  tone="info"
                  variant="soft"
                  accessibilityLabel={`${medias.length} adjuntos`}
                >
                  {medias.length}
                </AppBadge>
              ) : null}
            </AppInline>

            <AppInline gap="xs" align="center">
              <AppIcon icon={CalendarClock} size="sm" tone="muted" decorative />

              <AppText variant="bodySmall" tone="secondary">
                {formatTicketDate(ticket.abiertoEn)}
              </AppText>
            </AppInline>
          </AppInline>

          {/* ==================================================
              TÍTULO / DESCRIPCIÓN
             ================================================== */}

          <AppStack gap="xs">
            <AppText variant="titleMedium" weight="semibold" numberOfLines={2}>
              {ticket.titulo || "Ticket sin título"}
            </AppText>

            <AppText variant="bodySmall" tone="secondary" numberOfLines={3}>
              {ticket.descripcion || "Sin descripción registrada."}
            </AppText>
          </AppStack>

          {/* ==================================================
              CLIENTE
             ================================================== */}

          <AppStack gap="sm">
            <AppInline gap="sm" align="flex-start">
              <AppIcon icon={User} size="sm" tone="muted" decorative />

              <AppStack gap="xs" flex={1}>
                <AppText variant="bodySmall" tone="secondary">
                  {ticket.clientId ? `Cliente #${ticket.clientId}` : "Cliente"}
                </AppText>

                <AppText
                  variant="bodyMedium"
                  weight="semibold"
                  numberOfLines={1}
                >
                  {ticket.clienteNombre || "Cliente sin nombre"}
                </AppText>
              </AppStack>
            </AppInline>

            {addressText ? (
              <AppInline gap="sm" align="flex-start">
                <AppIcon icon={MapPin} size="sm" tone="muted" decorative />

                <AppText
                  variant="bodySmall"
                  tone="secondary"
                  numberOfLines={2}
                  style={{
                    flex: 1,
                  }}
                >
                  {addressText}
                </AppText>
              </AppInline>
            ) : null}
          </AppStack>

          {/* ==================================================
              MEDIAS
             ================================================== */}

          {medias.length > 0 ? <TicketMediaStrip medias={medias} /> : null}

          {/* ==================================================
              CONTACTOS
             ================================================== */}

          <AppStack gap="sm">
            <TicketContactActions
              label="Contacto principal"
              phone={ticket.clienteTel}
              onCopy={onCopyText}
            />

            {ticket.referenciaContacto ? (
              <TicketContactActions
                label="Referencia"
                phone={ticket.referenciaContacto}
                compact
                onCopy={onCopyText}
              />
            ) : null}
          </AppStack>

          {/* ==================================================
              UBICACIÓN
             ================================================== */}

          <TicketLocationActions
            location={ticket.ubicacionMaps}
            onCopy={onCopyText}
          />

          {/* ==================================================
              CICLO / DETALLE
             ================================================== */}

          <AppGrid gap="sm" minItemWidth={150}>
            {lifecycleAction ? (
              <AppButton
                size="md"
                variant={lifecycleAction === "review" ? "soft" : "solid"}
                tone={lifecycleAction === "review" ? "info" : "primary"}
                leadingIcon={lifecycleAction === "review" ? Send : Wrench}
                fullWidth
                loading={isMutating}
                disabled={isMutating}
                loadingAccessibilityLabel="Actualizando ticket"
                onPress={() => {
                  setPendingAction(lifecycleAction);
                }}
              >
                {lifecycleAction === "review"
                  ? "Enviar a revisión"
                  : "Tomar en proceso"}
              </AppButton>
            ) : (
              <AppButton
                size="md"
                variant="soft"
                tone="neutral"
                leadingIcon={CheckCircle2}
                fullWidth
                disabled
              >
                {getTicketBlockedActionLabel(ticket.estado)}
              </AppButton>
            )}

            <AppButton
              size="md"
              variant="soft"
              tone="info"
              leadingIcon={Eye}
              fullWidth
              accessibilityLabel={`Ver detalle del ticket ${ticket.id}`}
              onPress={() => {
                onOpenDetails(ticket.id);
              }}
            >
              Ver detalles
            </AppButton>
          </AppGrid>
        </AppStack>
      </AppCard>

      {/* ====================================================
          CONFIRMACIÓN DEL CICLO
         ==================================================== */}

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
              Ticket #{ticket.id}
            </AppText>

            <AppText variant="bodyMedium" weight="semibold" numberOfLines={2}>
              {ticket.titulo || "Ticket sin título"}
            </AppText>
          </AppStack>
        </AppCard>
      </AppConfirmDialog>

      {/* ====================================================
          FEEDBACK
         ==================================================== */}

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
    </>
  );
}
