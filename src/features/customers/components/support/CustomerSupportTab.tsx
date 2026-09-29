import { useEffect, useMemo, useState } from "react";
import { Image, View } from "react-native";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  LifeBuoy,
  MessageSquareText,
  UserRound,
  UsersRound,
} from "lucide-react-native";
import { StyleSheet } from "react-native-unistyles";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppGrid,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  CustomerProfile,
  CustomerTicket,
  CustomerTicketFollowUp,
} from "../../api/customers.contracts.api";
import {
  formatCustomerDate,
  formatCustomerStatus,
  getCustomerStatusTone,
  paginateCustomerItems,
  sortCustomerTicketsNewestFirst,
} from "../../customers.helpers";
import { CustomerInfoField } from "../shared/CustomerInfoField";
import { CustomerSectionCard } from "../shared/CustomerSectionCard";

const TICKETS_PER_PAGE = 5;

export interface CustomerSupportTabProps {
  customer: CustomerProfile;
}

function formatSupportDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return formatCustomerDate(value);
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(minutes?: number | null) {
  if (minutes === null || minutes === undefined) {
    return "No registrado";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return remainingMinutes > 0
      ? `${hours} h ${remainingMinutes} min`
      : `${hours} h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours > 0
    ? `${days} d ${remainingHours} h`
    : `${days} d`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function CustomerFollowUpCard({
  followUp,
}: {
  followUp: CustomerTicketFollowUp;
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const avatarUrl =
    followUp.usuario.perfil.avatar?.trim() ||
    followUp.usuario.perfil.portadaUrl?.trim() ||
    null;

  const bio = followUp.usuario.perfil.bio?.trim() || null;
  const role = followUp.usuario.rol?.trim() || null;

  return (
    <AppCard variant="tonal" radius="md" padding="xs">
      <AppStack gap="xs">
        <AppInline gap="sm" align="flex-start">
          {avatarUrl && !avatarFailed ? (
            <Image
              source={{ uri: avatarUrl }}
              resizeMode="cover"
              accessibilityRole="image"
              accessibilityLabel={`Avatar de ${followUp.usuario.nombre}`}
              onError={() => setAvatarFailed(true)}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <AppText variant="labelSmall" weight="bold">
                {getInitials(followUp.usuario.nombre)}
              </AppText>
            </View>
          )}

          <AppStack gap="xxs" flex>
            <AppInline gap="xs" align="center" wrap>
              <AppText variant="bodySmall" weight="semibold">
                {followUp.usuario.nombre}
              </AppText>

              {role ? (
                <AppBadge size="sm" variant="soft" tone="neutral">
                  {formatCustomerStatus(role)}
                </AppBadge>
              ) : null}
            </AppInline>

            {bio ? (
              <AppText
                variant="caption"
                tone="secondary"
                numberOfLines={2}
              >
                {bio}
              </AppText>
            ) : null}

            <AppText variant="caption" tone="secondary">
              {formatSupportDateTime(followUp.creadoEn)}
            </AppText>
          </AppStack>
        </AppInline>

        <AppText variant="bodySmall">
          {followUp.descripcion}
        </AppText>
      </AppStack>
    </AppCard>
  );
}

function CustomerTicketCard({ ticket }: { ticket: CustomerTicket }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AppCard variant="outlined" radius="md" padding="sm">
      <AppStack gap="sm">
        <AppInline gap="sm" align="flex-start" justify="space-between">
          <AppStack gap="xxs" flex>
            <AppText variant="bodySmall" weight="semibold" numberOfLines={2}>
              #{ticket.id} · {ticket.titulo || "Ticket sin título"}
            </AppText>

            <AppText variant="caption" tone="secondary">
              {formatCustomerDate(ticket.fechaApertura)}
            </AppText>
          </AppStack>

          <AppStack gap="xs" align="flex-end">
            <AppBadge
              size="sm"
              variant="soft"
              tone={getCustomerStatusTone(ticket.estado)}
            >
              {formatCustomerStatus(ticket.estado)}
            </AppBadge>

            <AppBadge size="sm" variant="outlined" tone="neutral">
              {formatCustomerStatus(ticket.prioridad)}
            </AppBadge>
          </AppStack>
        </AppInline>

        <AppInline gap="xs" align="center">
          <UserRound size={14} />
          <AppText variant="caption" tone="secondary" style={{ flex: 1 }}>
            Técnico: {ticket.tecnico?.nombre || "Sin técnico registrado"}
          </AppText>
        </AppInline>

        <AppButton
          size="sm"
          variant="ghost"
          tone="neutral"
          trailingIcon={expanded ? ChevronUp : ChevronDown}
          onPress={() => setExpanded((current) => !current)}
        >
          {expanded ? "Ocultar detalle" : "Ver detalle"}
        </AppButton>

        {expanded ? (
          <AppStack gap="sm">
            {ticket.descripcion?.trim() ? (
              <AppStack gap="xxs">
                <AppText variant="labelSmall" tone="secondary">
                  Descripción
                </AppText>
                <AppText variant="bodySmall">{ticket.descripcion}</AppText>
              </AppStack>
            ) : null}

            {ticket.etiquetas.length > 0 ? (
              <AppInline gap="xs" align="center" wrap>
                {ticket.etiquetas.map((tag) => (
                  <AppBadge
                    key={tag.id}
                    size="sm"
                    variant="soft"
                    tone="info"
                  >
                    {tag.nombre}
                  </AppBadge>
                ))}
              </AppInline>
            ) : null}

            <AppCard variant="tonal" radius="md" padding="xs">
              <AppStack gap="xs">
                <AppInline gap="xs" align="center">
                  <UsersRound size={14} />
                  <AppText variant="labelSmall" weight="semibold">
                    Participantes
                  </AppText>
                </AppInline>

                <AppGrid gap="xs" minItemWidth={130}>
                  <CustomerInfoField
                    label="Creado por"
                    value={ticket.creadoPro?.nombre}
                  />
                  <CustomerInfoField
                    label="Técnico"
                    value={ticket.tecnico?.nombre}
                  />
                </AppGrid>

                {ticket.acompanantes.length > 0 ? (
                  <CustomerInfoField
                    label="Acompañantes"
                    value={ticket.acompanantes
                      .map((item) => item.nombre)
                      .join(", ")}
                  />
                ) : null}
              </AppStack>
            </AppCard>

            <AppCard variant="tonal" radius="md" padding="xs">
              <AppStack gap="xs">
                <AppInline gap="xs" align="center">
                  <CalendarDays size={14} />
                  <AppText variant="labelSmall" weight="semibold">
                    Fechas
                  </AppText>
                </AppInline>

                <AppGrid gap="xs" minItemWidth={130}>
                  <CustomerInfoField
                    label="Apertura"
                    value={formatCustomerDate(ticket.fechaApertura)}
                  />
                  <CustomerInfoField
                    label="Inicio atención"
                    value={formatCustomerDate(ticket.fechaInicioAtencion)}
                  />
                  <CustomerInfoField
                    label="Resolución técnica"
                    value={formatCustomerDate(ticket.fechaResolucionTecnico)}
                  />
                  <CustomerInfoField
                    label="Cierre"
                    value={formatCustomerDate(ticket.fechaCierre)}
                  />
                </AppGrid>
              </AppStack>
            </AppCard>

            {ticket.resumen ? (
              <AppCard variant="tonal" radius="md" padding="xs">
                <AppStack gap="xs">
                  <AppInline gap="xs" align="center">
                    <Clock3 size={14} />
                    <AppText variant="labelSmall" weight="semibold">
                      Resumen
                    </AppText>
                  </AppInline>

                  <AppGrid gap="xs" minItemWidth={130}>
                    <CustomerInfoField
                      label="Resolución"
                      value={ticket.resumen.resueltoComo}
                    />
                    <CustomerInfoField
                      label="Tiempo técnico"
                      value={formatDuration(
                        ticket.resumen.tiempoTecnicoMinutos,
                      )}
                    />
                    <CustomerInfoField
                      label="Tiempo total"
                      value={formatDuration(
                        ticket.resumen.tiempoTotalMinutos,
                      )}
                    />
                    <CustomerInfoField
                      label="Reaperturas"
                      value={ticket.resumen.numeroReaperturas}
                    />
                  </AppGrid>

                  {ticket.resumen.notasInternas?.trim() ? (
                    <CustomerInfoField
                      label="Notas internas"
                      value={ticket.resumen.notasInternas.trim()}
                    />
                  ) : null}
                </AppStack>
              </AppCard>
            ) : null}

            {ticket.seguimientos.length > 0 ? (
              <AppStack gap="xs">
                <AppInline gap="xs" align="center">
                  <MessageSquareText size={14} />
                  <AppText variant="labelSmall" weight="semibold">
                    {ticket.seguimientos.length === 1
                      ? "1 seguimiento"
                      : `${ticket.seguimientos.length} seguimientos`}
                  </AppText>
                </AppInline>

                {ticket.seguimientos.map((followUp) => (
                  <CustomerFollowUpCard
                    key={followUp.id}
                    followUp={followUp}
                  />
                ))}
              </AppStack>
            ) : null}
          </AppStack>
        ) : null}
      </AppStack>
    </AppCard>
  );
}

export function CustomerSupportTab({ customer }: CustomerSupportTabProps) {
  const [page, setPage] = useState(1);

  const tickets = useMemo(
    () => sortCustomerTicketsNewestFirst(customer.ticketSoporte),
    [customer.ticketSoporte],
  );

  const pagination = useMemo(
    () => paginateCustomerItems(tickets, page, TICKETS_PER_PAGE),
    [tickets, page],
  );

  useEffect(() => {
    if (page !== pagination.page) {
      setPage(pagination.page);
    }
  }, [page, pagination.page]);

  return (
    <CustomerSectionCard
      title="Historial de soporte"
      icon={LifeBuoy}
      description={`${customer.ticketSoporte.length} ticket${
        customer.ticketSoporte.length === 1 ? "" : "s"
      } registrado${customer.ticketSoporte.length === 1 ? "" : "s"}`}
    >
      {pagination.items.length > 0 ? (
        <AppStack gap="sm">
          {pagination.items.map((ticket) => (
            <CustomerTicketCard key={ticket.id} ticket={ticket} />
          ))}

          {pagination.totalPages > 1 ? (
            <AppCard variant="tonal" radius="md" padding="xs">
              <AppStack gap="xs">
                <AppInline gap="sm" align="center" justify="space-between">
                  <AppText variant="caption" tone="secondary">
                    {pagination.from}-{pagination.to} de {pagination.totalItems}
                  </AppText>
                  <AppText variant="caption" weight="semibold">
                    Página {pagination.page} / {pagination.totalPages}
                  </AppText>
                </AppInline>

                <AppInline gap="xs" align="center" justify="space-between">
                  <AppButton
                    size="sm"
                    variant="ghost"
                    tone="neutral"
                    leadingIcon={ChevronLeft}
                    disabled={pagination.page <= 1}
                    onPress={() => setPage((current) => current - 1)}
                  >
                    Anterior
                  </AppButton>

                  <AppButton
                    size="sm"
                    variant="ghost"
                    tone="neutral"
                    trailingIcon={ChevronRight}
                    disabled={pagination.page >= pagination.totalPages}
                    onPress={() => setPage((current) => current + 1)}
                  >
                    Siguiente
                  </AppButton>
                </AppInline>
              </AppStack>
            </AppCard>
          ) : null}
        </AppStack>
      ) : (
        <AppText variant="bodySmall" tone="secondary">
          Este cliente no tiene tickets de soporte registrados.
        </AppText>
      )}
    </CustomerSectionCard>
  );
}

const styles = StyleSheet.create((theme) => ({
  avatar: {
    width: 34,
    height: 34,
    flexShrink: 0,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceSecondary,
  },

  avatarFallback: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primaryContainer,
  },
}));
