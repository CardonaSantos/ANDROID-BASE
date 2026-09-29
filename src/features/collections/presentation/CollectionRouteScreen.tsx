import { FlashList } from "@shopify/flash-list";
import { List, Map, RefreshCw } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Linking, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
  AppEmptyState,
  AppErrorState,
  AppIconButton,
  AppScreen,
  AppScrollScreen,
  AppSegmentedControl,
  AppSnackbar,
  AppStack,
  AppStateView,
  AppTopBar,
} from "@/design-system";
import { useAuthProfileQuery } from "@/features/auth";

import type {
  CollectionClient,
  CollectionInvoice,
  CreateCollectionPaymentInput,
} from "../api/collections.contracts.api";
import {
  findCollectionClient,
  getMappableCollectionClients,
} from "../application/collections.selectors";
import {
  buildCollectionPaymentInput,
  createCollectionPaymentForm,
  type CollectionPaymentFormState,
} from "../application/collections.validation";
import {
  buildCollectionPhoneUrl,
  buildCollectionRouteUrl,
} from "../collections.helpers";
import { CollectionClientCard } from "../components/clients/CollectionClientCard";
import { CollectionRouteHeaderCard } from "../components/detail/CollectionRouteHeaderCard";
import { CollectionMapClientCard } from "../components/map/CollectionMapClientCard";
import { CollectionRouteMap } from "../components/map/CollectionRouteMap";
import { CollectionPaymentConfirmDialog } from "../components/payment/CollectionPaymentConfirmDialog";
import { CollectionPaymentDialog } from "../components/payment/CollectionPaymentDialog";
import { CollectionPaymentSuccessDialog } from "../components/payment/CollectionPaymentSuccessDialog";
import { useCollectionRouteDetailQuery } from "../hooks/collections.hooks";
import { useCreateCollectionPaymentMutation } from "../hooks/collections.mutations.hooks";

type RouteViewMode = "clients" | "map";

type PaymentTarget = {
  client: CollectionClient;
  invoice: CollectionInvoice;
};

type PaymentSuccess = {
  invoiceId: number;
  amount: number;
};

const VIEW_OPTIONS = [
  { value: "clients", label: "Clientes", icon: List },
  { value: "map", label: "Mapa", icon: Map },
] as const;

export interface CollectionRouteScreenProps {
  routeId: number;
  onBack: () => void;
  onCopyText: (value: string) => void | Promise<void>;
  onOpenClientProfile: (clientId: number) => void;
  onOpenReceipt: (invoiceId: number) => void;
}

export function CollectionRouteScreen({
  routeId,
  onBack,
  onCopyText,
  onOpenClientProfile,
  onOpenReceipt,
}: CollectionRouteScreenProps) {
  const [viewMode, setViewMode] = useState<RouteViewMode>("clients");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "success" | "danger";
  } | null>(null);

  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(null);
  const [paymentForm, setPaymentForm] =
    useState<CollectionPaymentFormState | null>(null);
  const [paymentValidationMessage, setPaymentValidationMessage] = useState<
    string | null
  >(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [preparedPayment, setPreparedPayment] =
    useState<CreateCollectionPaymentInput | null>(null);
  const [paymentSuccess, setPaymentSuccess] =
    useState<PaymentSuccess | null>(null);

  const hasValidRouteId = Number.isInteger(routeId) && routeId > 0;
  const profileQuery = useAuthProfileQuery();
  const collectorId = profileQuery.data?.id ?? 0;
  const routeQuery = useCollectionRouteDetailQuery(routeId);
  const paymentMutation = useCreateCollectionPaymentMutation();
  const route = routeQuery.data ?? null;

  const mappableClients = useMemo(
    () => getMappableCollectionClients(route?.clientes ?? []),
    [route?.clientes],
  );

  if (!hasValidRouteId) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Ruta de cobro"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />
        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="Ruta inválida"
            description="El identificador de la ruta no es válido."
            primaryAction={{ label: "Volver", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  if (routeQuery.isPending || profileQuery.isPending) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Ruta #${routeId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />
        <View style={styles.stateContainer}>
          <AppStateView
            fill
            icon={Map}
            tone="primary"
            title="Cargando ruta"
            description="Consultando clientes, facturas y ubicaciones."
            announceOnMount
          />
        </View>
      </View>
    );
  }

  if (routeQuery.isError || profileQuery.isError) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Ruta #${routeId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />
        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="No se pudo cargar la ruta"
            description="Revisa tu conexión o intenta nuevamente."
            primaryAction={{
              label: "Reintentar",
              icon: RefreshCw,
              loading: routeQuery.isFetching || profileQuery.isFetching,
              onPress: () => {
                void Promise.all([routeQuery.refetch(), profileQuery.refetch()]);
              },
            }}
            secondaryAction={{ label: "Volver", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Ruta #${routeId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />
        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="Ruta no disponible"
            description="No fue posible obtener la ruta solicitada."
            primaryAction={{ label: "Volver", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  const selectedMapClient =
    findCollectionClient(mappableClients, selectedClientId) ??
    mappableClients[0] ??
    null;
  const selectedMapClientId = selectedMapClient?.id ?? null;

  const handleCopyText = async (value: string) => {
    try {
      await onCopyText(value);
      setFeedback({ message: "Dato copiado", tone: "success" });
    } catch {
      setFeedback({ message: "No se pudo copiar el dato.", tone: "danger" });
    }
  };

  const handleCallPhone = async (phone: string) => {
    const url = buildCollectionPhoneUrl(phone);

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

  const handleOpenClientRoute = async (client: CollectionClient) => {
    const url = buildCollectionRouteUrl(client.ubicacion);

    if (!url) {
      setFeedback({
        message: "El cliente no tiene coordenadas válidas.",
        tone: "danger",
      });
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        setFeedback({
          message: "No se pudo abrir Google Maps.",
          tone: "danger",
        });
        return;
      }
      await Linking.openURL(url);
    } catch {
      setFeedback({
        message: "No se pudo abrir la ruta del cliente.",
        tone: "danger",
      });
    }
  };

  const handleOpenPayment = (
    client: CollectionClient,
    invoice: CollectionInvoice,
  ) => {
    setPaymentTarget({ client, invoice });
    setPaymentForm(createCollectionPaymentForm(invoice));
    setPaymentValidationMessage(null);
    setPreparedPayment(null);
    setPaymentDialogOpen(true);
  };

  const patchPaymentForm = (patch: Partial<CollectionPaymentFormState>) => {
    setPaymentForm((current) =>
      current
        ? {
            ...current,
            ...patch,
          }
        : current,
    );
    setPaymentValidationMessage(null);
  };

  const handleContinuePayment = () => {
    if (!paymentTarget || !paymentForm) {
      return;
    }

    if (!Number.isInteger(collectorId) || collectorId <= 0) {
      setPaymentValidationMessage("No se pudo identificar al cobrador actual.");
      return;
    }

    const result = buildCollectionPaymentInput({
      form: paymentForm,
      invoiceId: paymentTarget.invoice.id,
      clientId: paymentTarget.client.id,
      collectorId,
      routeId: route.id,
    });

    if (!result.success) {
      setPaymentValidationMessage(result.message);
      return;
    }

    setPreparedPayment(result.data);
    setPaymentDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!preparedPayment || !paymentTarget) {
      return;
    }

    try {
      await paymentMutation.mutateAsync(preparedPayment);

      setPaymentSuccess({
        invoiceId: paymentTarget.invoice.id,
        amount: preparedPayment.montoPagado,
      });
      setConfirmDialogOpen(false);
      setPaymentDialogOpen(false);
      setPaymentTarget(null);
      setPaymentForm(null);
      setPreparedPayment(null);
      setPaymentValidationMessage(null);
    } catch (error) {
      setFeedback({
        message: "No se pudo registrar el pago.",
        tone: "danger",
      });
      throw error;
    }
  };

  const renderHeader = () => (
    <AppStack gap="md" style={styles.header}>
      <CollectionRouteHeaderCard route={route} />

      <AppSegmentedControl<RouteViewMode>
        options={VIEW_OPTIONS}
        value={viewMode}
        onValueChange={setViewMode}
        size="sm"
        variant="outlined"
        accessibilityLabel="Vista de la ruta"
      />
    </AppStack>
  );

  return (
    <View style={styles.root}>
      <AppTopBar
        title={`Ruta #${route.id}`}
        subtitle={route.nombreRuta}
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
            accessibilityLabel="Actualizar ruta de cobro"
            loadingAccessibilityLabel="Actualizando ruta de cobro"
            loading={routeQuery.isFetching}
            disabled={paymentMutation.isPending}
            onPress={() => {
              void routeQuery.refetch();
            }}
          />
        }
      />

      {viewMode === "clients" ? (
        <AppScreen
          safeAreaEdges={[]}
          contentPaddingVertical="md"
          contentStyle={styles.screenContent}
        >
          <FlashList
            data={route.clientes}
            style={styles.list}
            keyExtractor={(client) => String(client.id)}
            renderItem={({ item }) => (
              <CollectionClientCard
                client={item}
                expanded={expandedClientId === item.id}
                selected={selectedClientId === item.id}
                onExpandedChange={(expanded) => {
                  if (expanded) {
                    setExpandedClientId(item.id);
                    setSelectedClientId(item.id);
                    return;
                  }

                  if (expandedClientId === item.id) {
                    setExpandedClientId(null);
                  }
                }}
                onCopyText={handleCopyText}
                onCallPhone={(phone) => {
                  void handleCallPhone(phone);
                }}
                onOpenRoute={(client) => {
                  void handleOpenClientRoute(client);
                }}
                onOpenProfile={onOpenClientProfile}
                onOpenPayment={handleOpenPayment}
                onOpenReceipt={onOpenReceipt}
              />
            )}
            ItemSeparatorComponent={ClientSeparator}
            ListHeaderComponent={renderHeader()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AppEmptyState
                  title="Sin clientes en ruta"
                  description="Esta ruta no tiene clientes asignados."
                />
              </View>
            }
            ListFooterComponent={<View style={styles.footer} />}
            refreshing={routeQuery.isRefetching}
            onRefresh={() => {
              void routeQuery.refetch();
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </AppScreen>
      ) : (
        <AppScrollScreen
          safeAreaEdges={[]}
          contentPaddingVertical="md"
          scrollStyle={styles.scroll}
          scrollContentStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AppStack gap="md">
            {renderHeader()}

            <CollectionRouteMap
              clients={mappableClients}
              selectedClientId={selectedMapClientId}
              onSelectClient={(clientId) => {
                setSelectedClientId(clientId);
                setExpandedClientId(clientId);
              }}
            />

            {selectedMapClient ? (
              <CollectionMapClientCard
                client={selectedMapClient}
                onOpenProfile={onOpenClientProfile}
                onOpenRoute={(client) => {
                  void handleOpenClientRoute(client);
                }}
              />
            ) : null}
          </AppStack>
        </AppScrollScreen>
      )}

      <CollectionPaymentDialog
        open={paymentDialogOpen}
        client={paymentTarget?.client ?? null}
        invoice={paymentTarget?.invoice ?? null}
        form={paymentForm}
        validationMessage={paymentValidationMessage}
        disabled={paymentMutation.isPending}
        onOpenChange={(open) => {
          setPaymentDialogOpen(open);

          if (!open && !confirmDialogOpen) {
            setPaymentTarget(null);
            setPaymentForm(null);
            setPreparedPayment(null);
            setPaymentValidationMessage(null);
          }
        }}
        onPatch={patchPaymentForm}
        onContinue={handleContinuePayment}
      />

      <CollectionPaymentConfirmDialog
        open={confirmDialogOpen}
        client={paymentTarget?.client ?? null}
        invoice={paymentTarget?.invoice ?? null}
        input={preparedPayment}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmPayment}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setPaymentDialogOpen(true);
        }}
      />

      <CollectionPaymentSuccessDialog
        open={paymentSuccess !== null}
        invoiceId={paymentSuccess?.invoiceId ?? null}
        amount={paymentSuccess?.amount ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setPaymentSuccess(null);
          }
        }}
        onStay={() => {
          setPaymentSuccess(null);
        }}
        onOpenReceipt={(invoiceId) => {
          setPaymentSuccess(null);
          onOpenReceipt(invoiceId);
        }}
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
    </View>
  );
}

function ClientSeparator() {
  return <View style={styles.separator} />;
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
    marginBottom: theme.spacing.md,
  },
  separator: {
    height: theme.spacing.md,
  },
  emptyContainer: {
    paddingVertical: theme.spacing["2xl"],
  },
  footer: {
    height: theme.spacing.lg,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
}));
