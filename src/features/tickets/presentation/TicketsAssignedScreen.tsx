import { FlashList } from "@shopify/flash-list";

import { RefreshCw, TicketCheck } from "lucide-react-native";

import { useEffect, useMemo, useState } from "react";

import { View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppButton,
  AppEmptyState,
  AppErrorState,
  AppInline,
  AppScreen,
  AppStack,
  AppStateView,
  AppText,
} from "@/design-system";

import { useAuthProfileQuery } from "@/features/auth";

import { TicketAssignedCard } from "../components/TicketAssignedCard";

import { TicketsAssignedSummary } from "../components/TicketsAssignedSummary";

import { TicketsPagination } from "../components/TicketsPagination";

import { useAssignedTicketsQuery } from "../hooks/tickets.hooks";

import { getTicketStats, sortTicketsForTechnician } from "../tickets.helpers";

/*
 * =========================================================
 * CONSTANTS
 * =========================================================
 */

const PAGE_SIZE = 10;

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface TicketsAssignedScreenProps {
  onOpenDetails: (ticketId: number) => void;

  onCopyText: (value: string) => void | Promise<void>;
}

/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export function TicketsAssignedScreen({
  onOpenDetails,
  onCopyText,
}: TicketsAssignedScreenProps) {
  /*
   * =======================================================
   * PAGINATION
   * =======================================================
   */

  const [page, setPage] = useState(1);

  /*
   * =======================================================
   * PROFILE
   * =======================================================
   */

  const profileQuery = useAuthProfileQuery();

  const technicianId = profileQuery.data?.id ?? 0;

  const hasTechnicianId = Number.isInteger(technicianId) && technicianId > 0;

  /*
   * =======================================================
   * QUERY
   * =======================================================
   */

  const ticketsQuery = useAssignedTicketsQuery(technicianId);

  /*
   * =======================================================
   * DERIVED DATA
   * =======================================================
   *
   * El endpoint actual devuelve todos los tickets.
   *
   * La paginación se aplica únicamente en la aplicación.
   * Las estadísticas continúan calculándose contra el
   * conjunto completo.
   * =======================================================
   */

  const allTickets = useMemo(
    () => [...(ticketsQuery.data ?? [])].sort(sortTicketsForTechnician),
    [ticketsQuery.data],
  );

  const stats = useMemo(() => getTicketStats(allTickets), [allTickets]);

  const total = allTickets.length;

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  /*
   * Si la cantidad de tickets disminuye y la página actual
   * deja de existir, volvemos automáticamente a la última
   * página disponible.
   */
  const safePage = Math.min(Math.max(page, 1), totalPages);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  /*
   * Únicamente entregamos al FlashList los elementos
   * correspondientes a la página visible.
   */
  const tickets = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return allTickets.slice(start, start + PAGE_SIZE);
  }, [allTickets, safePage]);

  /*
   * =======================================================
   * PAGE CHANGE
   * =======================================================
   */

  const handlePageChange = (nextPage: number) => {
    const normalizedPage = Math.min(Math.max(nextPage, 1), totalPages);

    if (normalizedPage === safePage) {
      return;
    }

    setPage(normalizedPage);
  };

  /*
   * =======================================================
   * LOADING
   * =======================================================
   */

  const isInitialLoading =
    profileQuery.isPending || (hasTechnicianId && ticketsQuery.isPending);

  if (isInitialLoading) {
    return (
      <AppScreen contentStyle={styles.screenContent}>
        <AppStateView
          fill
          icon={TicketCheck}
          tone="primary"
          title="Cargando tickets"
          description="Consultando tus tickets técnicos asignados."
          announceOnMount
        />
      </AppScreen>
    );
  }

  /*
   * =======================================================
   * PROFILE / ID ERROR
   * =======================================================
   */

  if (profileQuery.isError || !profileQuery.data || !hasTechnicianId) {
    return (
      <AppScreen contentStyle={styles.screenContent}>
        <AppErrorState
          fill
          title="No se pudo identificar al técnico"
          description="No fue posible obtener la información necesaria para consultar tus tickets."
          primaryAction={{
            label: "Reintentar",
            icon: RefreshCw,
            loading: profileQuery.isFetching,
            onPress: () => {
              void profileQuery.refetch();
            },
          }}
        />
      </AppScreen>
    );
  }

  /*
   * =======================================================
   * TICKETS ERROR
   * =======================================================
   */

  if (ticketsQuery.isError) {
    return (
      <AppScreen contentStyle={styles.screenContent}>
        <AppErrorState
          fill
          title="No se pudieron cargar los tickets"
          description="Revisa tu conexión o intenta consultar nuevamente."
          primaryAction={{
            label: "Reintentar",
            icon: RefreshCw,
            loading: ticketsQuery.isFetching,
            onPress: () => {
              void ticketsQuery.refetch();
            },
          }}
        />
      </AppScreen>
    );
  }

  /*
   * =======================================================
   * CONTENT
   * =======================================================
   */

  return (
    <AppScreen contentStyle={styles.screenContent}>
      <FlashList
        data={tickets}
        style={styles.list}
        keyExtractor={(ticket) => String(ticket.id)}
        renderItem={({ item }) => (
          <TicketAssignedCard
            ticket={item}
            onOpenDetails={onOpenDetails}
            onCopyText={onCopyText}
          />
        )}
        ItemSeparatorComponent={TicketSeparator}
        /*
         * ===============================================
         * HEADER
         * ===============================================
         */
        ListHeaderComponent={
          <AppStack gap="lg" style={styles.header}>
            <AppInline gap="md" align="center" justify="space-between" wrap>
              <AppStack gap="xs" flex>
                <AppText variant="titleMedium" weight="semibold">
                  Mis tickets
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  Tickets técnicos asignados a tu usuario.
                </AppText>
              </AppStack>

              <AppButton
                size="sm"
                variant="outlined"
                tone="neutral"
                leadingIcon={RefreshCw}
                loading={ticketsQuery.isFetching}
                loadingAccessibilityLabel="Actualizando tickets"
                accessibilityLabel="Actualizar tickets asignados"
                onPress={() => {
                  void ticketsQuery.refetch();
                }}
              >
                Actualizar
              </AppButton>
            </AppInline>

            <TicketsAssignedSummary
              stats={stats}
              isFetching={ticketsQuery.isFetching}
            />

            <AppInline gap="xs" align="center">
              <AppText variant="bodySmall" tone="secondary">
                Asignados:
              </AppText>

              <AppText variant="bodySmall" weight="semibold">
                {total}
              </AppText>
            </AppInline>
          </AppStack>
        }
        /*
         * ===============================================
         * EMPTY
         * ===============================================
         */
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppEmptyState
              title="Sin tickets asignados"
              description="Actualmente no tienes tickets técnicos pendientes."
            />
          </View>
        }
        /*
         * ===============================================
         * PAGINATION
         * ===============================================
         */
        ListFooterComponent={
          total > 0 ? (
            <View style={styles.paginationContainer}>
              <TicketsPagination
                page={safePage}
                totalPages={totalPages}
                total={total}
                limit={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </View>
          ) : (
            <View style={styles.footer} />
          )
        }
        /*
         * ===============================================
         * REFRESH
         * ===============================================
         */
        refreshing={ticketsQuery.isFetching}
        onRefresh={() => {
          void ticketsQuery.refetch();
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </AppScreen>
  );
}

/*
 * =========================================================
 * LIST PARTS
 * =========================================================
 */

function TicketSeparator() {
  return <View style={styles.separator} />;
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles = StyleSheet.create((theme) => ({
  screenContent: {
    flex: 1,

    minHeight: 0,
  },

  list: {
    flex: 1,

    minHeight: 0,
  },

  listContent: {
    paddingBottom: theme.spacing.xl,
  },

  header: {
    marginBottom: theme.spacing.lg,
  },

  separator: {
    height: theme.spacing.lg,
  },

  emptyContainer: {
    paddingVertical: theme.spacing["2xl"],
  },

  paginationContainer: {
    paddingTop: theme.spacing.xl,

    paddingBottom: theme.spacing.sm,
  },

  footer: {
    height: theme.spacing.lg,
  },
}));
