import { FlashList } from "@shopify/flash-list";

import { ClipboardList, RefreshCw } from "lucide-react-native";

import { useState } from "react";

import { Linking, View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppButton,
  AppEmptyState,
  AppErrorState,
  AppInline,
  AppScreen,
  AppSnackbar,
  AppStack,
  AppStateView,
  AppText,
} from "@/design-system";

import type { InstallationLocation } from "../api/installations.contracts.api";

import { InstallationAssignedCard } from "../components/list/InstallationAssignedCard";

import { InstallationsPagination } from "../components/list/InstallationsPagination";

import { useAssignedInstallationsQuery } from "../hooks/installations.hooks";

import { buildInstallationRouteUrl } from "../installations.helpers";

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

export interface InstallationsAssignedScreenProps {
  onOpenDetails: (installationId: number) => void;
}

/*
 * =========================================================
 * PHONE
 * =========================================================
 */

function normalizePhoneForCall(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-().]/g, "");

  if (!cleaned) {
    return null;
  }

  if (cleaned.startsWith("+502")) {
    return cleaned;
  }

  if (cleaned.startsWith("502")) {
    return `+${cleaned}`;
  }

  return `+502${cleaned}`;
}

/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export function InstallationsAssignedScreen({
  onOpenDetails,
}: InstallationsAssignedScreenProps) {
  /*
   * =======================================================
   * PAGINATION STATE
   * =======================================================
   */

  const [page, setPage] = useState(1);

  /*
   * =======================================================
   * FEEDBACK
   * =======================================================
   */

  const [feedback, setFeedback] = useState<{
    message: string;

    tone: "success" | "danger";
  } | null>(null);

  /*
   * =======================================================
   * QUERY
   * =======================================================
   *
   * La página ahora es explícita.
   *
   * GET /mis-asignadas
   *
   * ?page=1
   * &limit=10
   * =======================================================
   */

  const installationsQuery = useAssignedInstallationsQuery({
    page,

    limit: PAGE_SIZE,
  });

  /*
   * =======================================================
   * DERIVED DATA
   * =======================================================
   */

  const installations = installationsQuery.data?.data ?? [];

  const meta = installationsQuery.data?.meta;

  const total = meta?.total ?? 0;

  /*
   * keepPreviousData mantiene la página anterior
   * mientras llega la nueva.
   *
   * isPlaceholderData nos permite distinguir ese
   * cambio de página de un refresh normal.
   */
  const isChangingPage =
    installationsQuery.isPlaceholderData && installationsQuery.isFetching;

  const isRefreshing =
    installationsQuery.isRefetching && !installationsQuery.isPlaceholderData;

  /*
   * =======================================================
   * CALL
   * =======================================================
   */

  const handleCallPhone = async (phone: string) => {
    const normalized = normalizePhoneForCall(phone);

    if (!normalized) {
      setFeedback({
        message: "El teléfono no es válido.",

        tone: "danger",
      });

      return;
    }

    const url = `tel:${normalized}`;

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        setFeedback({
          message: "Este dispositivo no puede realizar llamadas.",

          tone: "danger",
        });

        return;
      }

      await Linking.openURL(url);
    } catch {
      setFeedback({
        message: "No se pudo abrir la aplicación de llamadas.",

        tone: "danger",
      });
    }
  };

  /*
   * =======================================================
   * ROUTE
   * =======================================================
   */

  const handleOpenRoute = async (location: InstallationLocation) => {
    const url = buildInstallationRouteUrl(location);

    if (!url) {
      setFeedback({
        message: "La instalación no tiene coordenadas válidas.",

        tone: "danger",
      });

      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        setFeedback({
          message: "No se pudo abrir la ubicación.",

          tone: "danger",
        });

        return;
      }

      await Linking.openURL(url);
    } catch {
      setFeedback({
        message: "No se pudo abrir la ruta de la instalación.",

        tone: "danger",
      });
    }
  };

  /*
   * =======================================================
   * PAGE CHANGE
   * =======================================================
   */

  const handlePageChange = (nextPage: number) => {
    if (isChangingPage) {
      return;
    }

    const totalPages = meta?.totalPages ?? 1;

    const normalizedPage = Math.min(
      Math.max(nextPage, 1),

      Math.max(totalPages, 1),
    );

    if (normalizedPage === page) {
      return;
    }

    setPage(normalizedPage);
  };

  /*
   * =======================================================
   * INITIAL LOADING
   * =======================================================
   */

  if (installationsQuery.isPending) {
    return (
      <AppScreen contentStyle={styles.screenContent}>
        <AppStateView
          fill
          icon={ClipboardList}
          tone="primary"
          title="Cargando instalaciones"
          description="Consultando los trabajos que tienes asignados."
          announceOnMount
        />
      </AppScreen>
    );
  }

  /*
   * =======================================================
   * ERROR
   * =======================================================
   */

  if (installationsQuery.isError) {
    return (
      <AppScreen contentStyle={styles.screenContent}>
        <AppErrorState
          fill
          title="No se pudieron cargar las instalaciones"
          description="Revisa tu conexión o intenta consultar nuevamente."
          primaryAction={{
            label: "Reintentar",

            icon: RefreshCw,

            loading: installationsQuery.isRefetching,

            onPress: () => {
              void installationsQuery.refetch();
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
        data={installations}
        style={styles.list}
        keyExtractor={(installation) => String(installation.id)}
        renderItem={({ item }) => (
          <InstallationAssignedCard
            installation={item}
            onOpenDetails={onOpenDetails}
            onCallPhone={handleCallPhone}
            onOpenRoute={handleOpenRoute}
          />
        )}
        ItemSeparatorComponent={InstallationSeparator}
        /* ===============================================
           HEADER
           =============================================== */
        ListHeaderComponent={
          <AppStack gap="lg" style={styles.header}>
            <AppInline gap="md" align="center" justify="space-between" wrap>
              <AppStack gap="xs" flex>
                <AppText variant="headlineSmall" weight="semibold">
                  Mis instalaciones
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  Trabajos asignados a tu usuario técnico.
                </AppText>
              </AppStack>

              <AppButton
                size="sm"
                variant="outlined"
                tone="neutral"
                leadingIcon={RefreshCw}
                loading={isRefreshing}
                disabled={isChangingPage}
                loadingAccessibilityLabel="Actualizando instalaciones"
                accessibilityLabel="Actualizar instalaciones asignadas"
                onPress={() => {
                  void installationsQuery.refetch();
                }}
              >
                Actualizar
              </AppButton>
            </AppInline>

            <AppInline gap="xs" align="center">
              <AppText variant="bodySmall" tone="secondary">
                Asignadas:
              </AppText>

              <AppText variant="bodySmall" weight="semibold">
                {total}
              </AppText>
            </AppInline>
          </AppStack>
        }
        /* ===============================================
           EMPTY
           =============================================== */
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppEmptyState
              title="Sin instalaciones asignadas"
              description="Actualmente no tienes trabajos de instalación pendientes o asignados."
            />
          </View>
        }
        /* ===============================================
           PAGINATION
           =============================================== */
        ListFooterComponent={
          total > 0 && meta ? (
            <View style={styles.paginationContainer}>
              <InstallationsPagination
                page={page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={meta.limit}
                loading={isChangingPage}
                onPageChange={handlePageChange}
              />
            </View>
          ) : (
            <View style={styles.footer} />
          )
        }
        /* ===============================================
           REFRESH
           =============================================== */
        refreshing={isRefreshing}
        onRefresh={() => {
          void installationsQuery.refetch();
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

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
    </AppScreen>
  );
}

/*
 * =========================================================
 * LIST PARTS
 * =========================================================
 */

function InstallationSeparator() {
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
