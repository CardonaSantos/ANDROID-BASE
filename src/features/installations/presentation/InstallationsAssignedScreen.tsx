import { FlashList } from "@shopify/flash-list";

import { ClipboardList, RefreshCw } from "lucide-react-native";

import { useMemo, useState } from "react";

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

import { useAssignedInstallationsInfiniteQuery } from "../hooks/installations.hooks";

import { buildInstallationRouteUrl } from "../installations.helpers";

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
 *
 * Por ahora la bandeja solo necesita llamada directa.
 *
 * No lo promovemos al Design System porque es comportamiento
 * de aplicación, no presentación.
 * =========================================================
 */

function normalizePhoneForCall(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-().]/g, "");

  if (!cleaned) {
    return null;
  }

  /*
   * Si el servidor ya entrega código de Guatemala,
   * evitamos duplicarlo.
   */
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
  const [feedback, setFeedback] = useState<{
    message: string;

    tone: "success" | "danger";
  } | null>(null);

  /*
   * =======================================================
   * QUERY
   * =======================================================
   *
   * Primera versión:
   * sin filtros visibles todavía.
   *
   * TanStack administra pageParam internamente.
   * =======================================================
   */

  const installationsQuery = useAssignedInstallationsInfiniteQuery();

  /*
   * =======================================================
   * DERIVED DATA
   * =======================================================
   */

  const installations = useMemo(
    () => installationsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [installationsQuery.data],
  );

  const total =
    installationsQuery.data?.pages[0]?.meta.total ?? installations.length;

  /*
   * =======================================================
   * PLATFORM ACTIONS
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
   * PAGINATION
   * =======================================================
   */

  const handleEndReached = () => {
    if (
      !installationsQuery.hasNextPage ||
      installationsQuery.isFetchingNextPage
    ) {
      return;
    }

    void installationsQuery.fetchNextPage();
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
                loading={installationsQuery.isRefetching}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppEmptyState
              title="Sin instalaciones asignadas"
              description="Actualmente no tienes trabajos de instalación pendientes o asignados."
            />
          </View>
        }
        ListFooterComponent={
          installationsQuery.isFetchingNextPage ? (
            <View style={styles.loadingMore}>
              <AppText variant="bodySmall" tone="secondary" align="center">
                Cargando más instalaciones...
              </AppText>
            </View>
          ) : (
            <View style={styles.footer} />
          )
        }
        refreshing={
          installationsQuery.isRefetching &&
          !installationsQuery.isFetchingNextPage
        }
        onRefresh={() => {
          void installationsQuery.refetch();
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.35}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

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

  /*
   * Igual que en Tickets:
   * FlashList debe poseer un viewport acotado,
   * especialmente en Web.
   */
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

  loadingMore: {
    paddingVertical: theme.spacing.lg,
  },

  footer: {
    height: theme.spacing.lg,
  },
}));
