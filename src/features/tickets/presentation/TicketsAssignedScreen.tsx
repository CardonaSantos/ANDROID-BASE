import { FlashList } from "@shopify/flash-list";
import { RefreshCw, TicketCheck } from "lucide-react-native";
import { useMemo } from "react";
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

import { useAssignedTicketsQuery } from "../hooks/tickets.hooks";

import { getTicketStats, sortTicketsForTechnician } from "../tickets.helpers";

import { TicketAssignedCard } from "../components/TicketAssignedCard";

import { TicketsAssignedSummary } from "../components/TicketsAssignedSummary";

export interface TicketsAssignedScreenProps {
  onOpenDetails: (ticketId: number) => void;

  onCopyText: (value: string) => void | Promise<void>;
}

export function TicketsAssignedScreen({
  onOpenDetails,
  onCopyText,
}: TicketsAssignedScreenProps) {
  const profileQuery = useAuthProfileQuery();

  const technicianId = profileQuery.data?.id ?? 0;

  const hasTechnicianId = Number.isInteger(technicianId) && technicianId > 0;

  const ticketsQuery = useAssignedTicketsQuery(technicianId);

  /*
   * =========================================================
   * DERIVED DATA
   * =========================================================
   */

  const tickets = useMemo(
    () => [...(ticketsQuery.data ?? [])].sort(sortTicketsForTechnician),
    [ticketsQuery.data],
  );

  const stats = useMemo(() => getTicketStats(tickets), [tickets]);

  /*
   * =========================================================
   * LOADING
   * =========================================================
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
   * =========================================================
   * PROFILE / ID ERROR
   * =========================================================
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
   * =========================================================
   * TICKETS ERROR
   * =========================================================
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
   * =========================================================
   * CONTENT
   * =========================================================
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
        ListHeaderComponent={
          <AppStack gap="lg" style={styles.header}>
            <AppInline gap="md" align="center" justify="space-between" wrap>
              <AppStack gap="xs" flex>
                <AppText variant="headlineSmall" weight="semibold">
                  Mis tickets
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  Ordenados por prioridad, estado y fecha de apertura.
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
          </AppStack>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppEmptyState
              title="Sin tickets asignados"
              description="Actualmente no tienes tickets técnicos pendientes."
            />
          </View>
        }
        ListFooterComponent={<View style={styles.footer} />}
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

function TicketSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create((theme) => ({
  screenContent: {
    flex: 1,
  },

  list: {
    flex: 1,
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

  footer: {
    height: theme.spacing.lg,
  },
}));
