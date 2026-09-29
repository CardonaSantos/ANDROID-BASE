import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LifeBuoy,
  UserRound,
} from "lucide-react-native";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  CustomerProfile,
  CustomerTicket,
} from "../../api/customers.contracts.api";
import {
  formatCustomerDate,
  formatCustomerStatus,
  getCustomerStatusTone,
  paginateCustomerItems,
  sortCustomerTicketsNewestFirst,
} from "../../customers.helpers";
import { CustomerSectionCard } from "../shared/CustomerSectionCard";

const TICKETS_PER_PAGE = 5;

export interface CustomerSupportTabProps {
  customer: CustomerProfile;
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

            {ticket.acompanantes.length > 0 ? (
              <AppText variant="caption" tone="secondary">
                Acompañantes: {ticket.acompanantes.map((item) => item.nombre).join(", ")}
              </AppText>
            ) : null}

            {ticket.resumen ? (
              <AppCard variant="tonal" radius="md" padding="xs">
                <AppStack gap="xxs">
                  <AppText variant="labelSmall" weight="semibold">
                    Resumen
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    Resolución: {ticket.resumen.resueltoComo || "Sin especificar"}
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    Tiempo técnico: {ticket.resumen.tiempoTecnicoMinutos ?? 0} min
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    Reaperturas: {ticket.resumen.numeroReaperturas}
                  </AppText>
                  {ticket.resumen.notasInternas?.trim() ? (
                    <AppText variant="caption" tone="secondary">
                      {ticket.resumen.notasInternas}
                    </AppText>
                  ) : null}
                </AppStack>
              </AppCard>
            ) : null}

            {ticket.seguimientos.length > 0 ? (
              <AppStack gap="xs">
                <AppText variant="labelSmall" weight="semibold">
                  Seguimientos
                </AppText>

                {ticket.seguimientos.map((followUp) => (
                  <AppCard
                    key={followUp.id}
                    variant="tonal"
                    radius="md"
                    padding="xs"
                  >
                    <AppStack gap="xxs">
                      <AppText variant="bodySmall">
                        {followUp.descripcion}
                      </AppText>
                      <AppText variant="caption" tone="secondary">
                        {followUp.usuario.nombre} · {formatCustomerDate(followUp.creadoEn)}
                      </AppText>
                    </AppStack>
                  </AppCard>
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
