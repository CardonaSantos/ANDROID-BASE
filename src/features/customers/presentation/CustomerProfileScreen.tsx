import { useState } from "react";
import { View } from "react-native";
import { RefreshCw } from "lucide-react-native";
import { StyleSheet } from "react-native-unistyles";

import {
  AppErrorState,
  AppIconButton,
  AppScrollScreen,
  AppStack,
  AppStateView,
  AppTabs,
  AppTopBar,
} from "@/design-system";

import { CustomerProfileHeader } from "../components/CustomerProfileHeader";
import { CustomerBillingTab } from "../components/billing/CustomerBillingTab";
import { CustomerLocationTab } from "../components/location/CustomerLocationTab";
import { CustomerMediaTab } from "../components/media/CustomerMediaTab";
import { CustomerOverviewTab } from "../components/overview/CustomerOverviewTab";
import { CustomerSupportTab } from "../components/support/CustomerSupportTab";
import { useCustomerProfileQuery } from "../hooks/customers.hooks";

type CustomerProfileTab =
  | "general"
  | "billing"
  | "support"
  | "location"
  | "media";

const PROFILE_TABS = [
  { value: "general", label: "General" },
  { value: "billing", label: "Facturación" },
  { value: "support", label: "Soporte" },
  { value: "location", label: "Ubicación" },
  { value: "media", label: "Media" },
] as const;

export interface CustomerProfileScreenProps {
  customerId: number;
  onBack: () => void;
  onCopyText: (value: string) => void | Promise<void>;
}

export function CustomerProfileScreen({
  customerId,
  onBack,
  onCopyText,
}: CustomerProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<CustomerProfileTab>("general");
  const hasValidCustomerId = Number.isInteger(customerId) && customerId > 0;
  const customerQuery = useCustomerProfileQuery(customerId);

  if (!hasValidCustomerId) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Perfil del cliente"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="Cliente inválido"
            description="El identificador del cliente no es válido."
            primaryAction={{ label: "Volver", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  if (customerQuery.isPending) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Cliente #${customerId}`}
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
            title="Cargando cliente"
            description="Consultando perfil, facturación, soporte y media."
            announceOnMount
          />
        </View>
      </View>
    );
  }

  if (customerQuery.isError || !customerQuery.data) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Cliente #${customerId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="No se pudo cargar el cliente"
            description="Revisa tu conexión o intenta consultar nuevamente."
            primaryAction={{
              label: "Reintentar",
              icon: RefreshCw,
              loading: customerQuery.isFetching,
              onPress: () => {
                void customerQuery.refetch();
              },
            }}
            secondaryAction={{ label: "Volver", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  const customer = customerQuery.data;

  return (
    <View style={styles.root}>
      <AppTopBar
        title={`Cliente #${customer.id}`}
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
            accessibilityLabel="Actualizar perfil del cliente"
            loadingAccessibilityLabel="Actualizando perfil del cliente"
            loading={customerQuery.isFetching}
            onPress={() => {
              void customerQuery.refetch();
            }}
          />
        }
      />

      <AppScrollScreen
        safeAreaEdges={[]}
        contentPaddingVertical="sm"
        scrollStyle={styles.scroll}
        scrollContentStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppStack gap="sm">
          <CustomerProfileHeader customer={customer} />

          <AppTabs<CustomerProfileTab>
            options={PROFILE_TABS}
            value={activeTab}
            onValueChange={setActiveTab}
            variant="underline"
            scrollable
          />

          {activeTab === "general" ? (
            <CustomerOverviewTab customer={customer} onCopyText={onCopyText} />
          ) : null}

          {activeTab === "billing" ? (
            <CustomerBillingTab customer={customer} />
          ) : null}

          {activeTab === "support" ? (
            <CustomerSupportTab customer={customer} />
          ) : null}

          {activeTab === "location" ? (
            <CustomerLocationTab customer={customer} />
          ) : null}

          {activeTab === "media" ? (
            <CustomerMediaTab customer={customer} />
          ) : null}
        </AppStack>
      </AppScrollScreen>
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
    paddingBottom: theme.spacing.xl,
  },
}));
