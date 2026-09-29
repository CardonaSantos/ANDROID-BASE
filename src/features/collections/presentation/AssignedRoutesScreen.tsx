import { useEffect, useMemo, useState } from "react";

import { FlashList } from "@shopify/flash-list";

import { ChevronLeft, ChevronRight, Map, RefreshCw } from "lucide-react-native";

import { View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppButton,
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppGrid,
  AppInline,
  AppScreen,
  AppStack,
  AppStateView,
  AppText,
} from "@/design-system";

import { useAuthProfileQuery } from "@/features/auth";

import { AssignedRouteCard } from "../components/routes/AssignedRouteCard";

import { AssignedRoutesSummary } from "../components/routes/AssignedRoutesSummary";

import { useAssignedCollectionRoutesQuery } from "../hooks/collections.hooks";

/*
 * =========================================================
 * PAGINACIÓN LOCAL
 * =========================================================
 *
 * El endpoint actual devuelve todas las rutas asignadas.
 *
 * Por ahora paginamos únicamente en presentación:
 *
 * response.rutas
 *      ↓
 * slice()
 *      ↓
 * FlashList
 *
 * Si posteriormente el servidor soporta page/limit,
 * esta capa puede reemplazarse sin modificar las cards.
 */

const ROUTES_PER_PAGE = 5;

export interface AssignedRoutesScreenProps {
  onOpenRoute: (routeId: number) => void;
}

export function AssignedRoutesScreen({
  onOpenRoute,
}: AssignedRoutesScreenProps) {
  const [page, setPage] = useState(1);

  /*
   * =========================================================
   * AUTH
   * =========================================================
   */

  const profileQuery = useAuthProfileQuery();

  const collectorId = profileQuery.data?.id ?? 0;

  const hasCollectorId = Number.isInteger(collectorId) && collectorId > 0;

  /*
   * =========================================================
   * QUERY
   * =========================================================
   */

  const routesQuery = useAssignedCollectionRoutesQuery(collectorId);

  const isInitialLoading =
    profileQuery.isPending || (hasCollectorId && routesQuery.isPending);

  /*
   * =========================================================
   * DATA
   * =========================================================
   */

  const data = routesQuery.data ?? {
    rutas: [],
    totales: {
      totalRutas: 0,
      totalClientes: 0,
    },
  };

  const totalRoutes = data.rutas.length;

  const totalPages = Math.max(Math.ceil(totalRoutes / ROUTES_PER_PAGE), 1);

  /*
   * Si después de refrescar disminuye el número de rutas,
   * evitamos quedar atrapados en una página inexistente.
   */
  useEffect(() => {
    setPage((currentPage) => Math.min(Math.max(currentPage, 1), totalPages));
  }, [totalPages]);

  /*
   * Si cambia el usuario autenticado empezamos nuevamente
   * desde la primera página.
   */
  useEffect(() => {
    setPage(1);
  }, [collectorId]);

  const paginatedRoutes = useMemo(() => {
    const start = (page - 1) * ROUTES_PER_PAGE;

    const end = start + ROUTES_PER_PAGE;

    return data.rutas.slice(start, end);
  }, [data.rutas, page]);

  const firstVisibleRoute =
    totalRoutes > 0 ? (page - 1) * ROUTES_PER_PAGE + 1 : 0;

  const lastVisibleRoute =
    totalRoutes > 0 ? Math.min(page * ROUTES_PER_PAGE, totalRoutes) : 0;

  const canGoPrevious = page > 1;

  const canGoNext = page < totalPages;

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (isInitialLoading) {
    return (
      <AppScreen contentStyle={styles.screenContent}>
        <AppStateView
          fill
          icon={Map}
          tone="primary"
          title="Cargando rutas"
          description="Consultando las rutas de cobro asignadas a tu usuario."
          announceOnMount
        />
      </AppScreen>
    );
  }

  /*
   * =========================================================
   * PROFILE ERROR
   * =========================================================
   */

  if (profileQuery.isError || !hasCollectorId) {
    return (
      <AppScreen contentStyle={styles.screenContent}>
        <AppErrorState
          fill
          title="No se pudo identificar al cobrador"
          description="La sesión no contiene un usuario válido para consultar rutas asignadas."
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
   * QUERY ERROR
   * =========================================================
   */

  if (routesQuery.isError) {
    return (
      <AppScreen contentStyle={styles.screenContent}>
        <AppErrorState
          fill
          title="No se pudieron cargar las rutas"
          description="Revisa tu conexión o intenta nuevamente."
          primaryAction={{
            label: "Reintentar",
            icon: RefreshCw,
            loading: routesQuery.isRefetching,

            onPress: () => {
              void routesQuery.refetch();
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
        /*
         * Al cambiar de página remonta la lista y vuelve
         * naturalmente al inicio.
         */
        key={`collections-routes-page-${page}`}
        data={paginatedRoutes}
        style={styles.list}
        keyExtractor={(route) => String(route.id)}
        renderItem={({ item }) => (
          <AssignedRouteCard route={item} onOpen={onOpenRoute} />
        )}
        ItemSeparatorComponent={RouteSeparator}
        ListHeaderComponent={
          <AppStack gap="lg" style={styles.header}>
            {/* =============================================
                TITLE
               ============================================= */}

            <AppInline gap="md" align="center" justify="space-between" wrap>
              <AppStack gap="xs" flex>
                <AppText variant="headlineSmall" weight="semibold">
                  Mis rutas de cobro
                </AppText>
              </AppStack>

              <AppButton
                size="sm"
                variant="outlined"
                tone="neutral"
                leadingIcon={RefreshCw}
                loading={routesQuery.isRefetching}
                loadingAccessibilityLabel="Actualizando rutas"
                onPress={() => {
                  void routesQuery.refetch();
                }}
              >
                Actualizar
              </AppButton>
            </AppInline>

            {/* =============================================
                TOTALS
               ============================================= */}

            <AssignedRoutesSummary
              totalRoutes={data.totales.totalRutas}
              totalClients={data.totales.totalClientes}
            />
          </AppStack>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppEmptyState
              title="Sin rutas asignadas"
              description="Cuando tengas una ruta de cobro asignada aparecerá aquí."
            />
          </View>
        }
        ListFooterComponent={
          totalRoutes > 0 ? (
            <RoutesPagination
              page={page}
              totalPages={totalPages}
              totalRoutes={totalRoutes}
              from={firstVisibleRoute}
              to={lastVisibleRoute}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              onPrevious={() => {
                if (!canGoPrevious) {
                  return;
                }

                setPage((current) => current - 1);
              }}
              onNext={() => {
                if (!canGoNext) {
                  return;
                }

                setPage((current) => current + 1);
              }}
            />
          ) : (
            <View style={styles.footer} />
          )
        }
        refreshing={routesQuery.isRefetching}
        onRefresh={() => {
          void routesQuery.refetch();
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </AppScreen>
  );
}

/*
 * =========================================================
 * PAGINATION
 * =========================================================
 */

interface RoutesPaginationProps {
  page: number;

  totalPages: number;

  totalRoutes: number;

  from: number;

  to: number;

  canGoPrevious: boolean;

  canGoNext: boolean;

  onPrevious: () => void;

  onNext: () => void;
}

function RoutesPagination({
  page,
  totalPages,
  totalRoutes,
  from,
  to,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: RoutesPaginationProps) {
  /*
   * Con una sola página no necesitamos mostrar botones.
   * Sí dejamos un pequeño espacio inferior.
   */
  if (totalPages <= 1) {
    return <View style={styles.footer} />;
  }

  return (
    <View style={styles.paginationContainer}>
      <AppCard variant="tonal" radius="lg" padding="sm">
        <AppStack gap="sm">
          {/* =============================================
              PAGE INFO
             ============================================= */}

          <AppInline gap="sm" align="center" justify="space-between" wrap>
            <AppText variant="bodySmall" tone="secondary">
              {`Mostrando ${from}-${to} de ${totalRoutes}`}
            </AppText>

            <AppText variant="bodySmall" weight="semibold">
              {`${page} / ${totalPages}`}
            </AppText>
          </AppInline>

          {/* =============================================
              ACTIONS
             ============================================= */}

          <AppGrid gap="sm" minItemWidth={130}>
            <AppButton
              size="sm"
              variant="outlined"
              tone="neutral"
              leadingIcon={ChevronLeft}
              fullWidth
              disabled={!canGoPrevious}
              accessibilityLabel="Ir a la página anterior de rutas"
              onPress={onPrevious}
            >
              Anterior
            </AppButton>

            <AppButton
              size="sm"
              variant="outlined"
              tone="primary"
              trailingIcon={ChevronRight}
              fullWidth
              disabled={!canGoNext}
              accessibilityLabel="Ir a la página siguiente de rutas"
              onPress={onNext}
            >
              Siguiente
            </AppButton>
          </AppGrid>
        </AppStack>
      </AppCard>
    </View>
  );
}

/*
 * =========================================================
 * SEPARATOR
 * =========================================================
 */

function RouteSeparator() {
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
    height: theme.spacing.md,
  },

  emptyContainer: {
    paddingVertical: theme.spacing["2xl"],
  },

  paginationContainer: {
    paddingTop: theme.spacing.lg,

    paddingBottom: theme.spacing.sm,
  },

  footer: {
    height: theme.spacing.lg,
  },
}));
