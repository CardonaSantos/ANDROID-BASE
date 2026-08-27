import { useState } from "react";

import {
  Activity,
  Bell,
  CheckCircle2,
  Clock3,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react-native";

import {
  AppAlert,
  AppBadge,
  AppButton,
  AppCard,
  AppGrid,
  AppInline,
  AppListItem,
  AppProgress,
  AppScrollScreen,
  AppSection,
  AppSectionHeader,
  AppStack,
  AppStat,
  AppText,
  AppToast,
} from "@/design-system";

export default function HomeScreen() {
  const [toastOpen, setToastOpen] = useState(false);

  const [synced, setSynced] = useState(true);

  const handleRefresh = () => {
    setSynced(true);
    setToastOpen(true);
  };

  return (
    <>
      <AppScrollScreen
        background="background"
        contained
        maxWidth="page"
        gutter="standard"
        contentPaddingVertical="xl"
      >
        <AppStack gap="2xl">
          <AppStack gap="md">
            <AppInline gap="sm" wrap>
              <AppBadge tone="primary" variant="soft">
                NOVA
              </AppBadge>

              <AppBadge
                tone={synced ? "success" : "warning"}
                variant="soft"
                icon={synced ? CheckCircle2 : Clock3}
              >
                {synced ? "Sincronizado" : "Pendiente"}
              </AppBadge>
            </AppInline>

            <AppText variant="headlineLarge" weight="bold">
              Dashboard
            </AppText>

            <AppText variant="bodyLarge" tone="secondary">
              Vista general de la aplicación y actividad reciente.
            </AppText>
          </AppStack>

          <AppGrid gap="lg" minItemWidth={210}>
            <AppStat
              label="Clientes"
              value="1,284"
              description="+24 este mes"
              icon={Users}
              tone="primary"
              variant="tonal"
            />

            <AppStat
              label="Ventas"
              value="Q 24,850"
              description="+8.4% mensual"
              icon={TrendingUp}
              tone="success"
              variant="tonal"
            />

            <AppStat
              label="Pedidos"
              value="86"
              description="12 pendientes"
              icon={ShoppingCart}
              tone="info"
              variant="outlined"
            />

            <AppStat
              label="Inventario"
              value="942"
              description="18 con stock bajo"
              icon={Package}
              tone="warning"
              variant="outlined"
            />
          </AppGrid>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Resumen financiero"
                description="Actividad del período actual."
              />
            }
          >
            <AppCard variant="outlined" padding="lg">
              <AppStack gap="xl">
                <AppInline gap="lg" wrap>
                  <AppStack gap="xs">
                    <AppText variant="labelMedium" tone="secondary">
                      Ingresos
                    </AppText>

                    <AppText variant="titleLarge" weight="bold">
                      Q 24,850
                    </AppText>
                  </AppStack>

                  <AppStack gap="xs">
                    <AppText variant="labelMedium" tone="secondary">
                      Pendiente
                    </AppText>

                    <AppText variant="titleLarge" weight="bold">
                      Q 3,420
                    </AppText>
                  </AppStack>
                </AppInline>

                <AppStack gap="sm">
                  <AppInline justify="space-between" align="center">
                    <AppText variant="bodyMedium" tone="secondary">
                      Meta mensual
                    </AppText>

                    <AppText variant="bodyMedium" weight="semibold">
                      72%
                    </AppText>
                  </AppInline>

                  <AppProgress
                    value={72}
                    tone="primary"
                    accessibilityLabel="Progreso de meta mensual"
                  />
                </AppStack>
              </AppStack>
            </AppCard>
          </AppSection>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Actividad"
                description="Movimientos recientes del sistema."
              />
            }
          >
            <AppCard variant="outlined" padding="none">
              <AppListItem
                title="Nuevo pedido #1842"
                description="Pedido registrado por María López."
                metadata="Ahora"
                disclosure
                onPress={() => {
                  setToastOpen(true);
                }}
              />

              <AppListItem
                title="Pago recibido"
                description="Factura #FAC-01834 pagada."
                metadata="12 min"
                disclosure
                onPress={() => {
                  setToastOpen(true);
                }}
              />

              <AppListItem
                title="Inventario actualizado"
                description="Se recibieron 24 unidades."
                metadata="35 min"
                disclosure
                onPress={() => {
                  setToastOpen(true);
                }}
              />
            </AppCard>
          </AppSection>

          <AppGrid gap="lg" minItemWidth={280}>
            <AppCard variant="tonal" tone="primary" padding="lg">
              <AppStack gap="lg">
                <AppInline gap="sm" align="center">
                  <WalletCards size={20} />

                  <AppText variant="titleMedium" weight="semibold">
                    Caja
                  </AppText>
                </AppInline>

                <AppText variant="headlineSmall" weight="bold">
                  Q 8,420.00
                </AppText>

                <AppText variant="bodyMedium" tone="secondary">
                  Disponible actualmente.
                </AppText>

                <AppButton
                  variant="outlined"
                  onPress={() => {
                    setToastOpen(true);
                  }}
                >
                  Ver movimientos
                </AppButton>
              </AppStack>
            </AppCard>

            <AppCard variant="outlined" padding="lg">
              <AppStack gap="lg">
                <AppInline gap="sm" align="center">
                  <Bell size={20} />

                  <AppText variant="titleMedium" weight="semibold">
                    Pendientes
                  </AppText>
                </AppInline>

                <AppStack gap="md">
                  <AppInline justify="space-between">
                    <AppText tone="secondary">Pedidos</AppText>

                    <AppBadge tone="warning" variant="soft">
                      12
                    </AppBadge>
                  </AppInline>

                  <AppInline justify="space-between">
                    <AppText tone="secondary">Cobros</AppText>

                    <AppBadge tone="danger" variant="soft">
                      7
                    </AppBadge>
                  </AppInline>

                  <AppInline justify="space-between">
                    <AppText tone="secondary">Revisiones</AppText>

                    <AppBadge tone="info" variant="soft">
                      4
                    </AppBadge>
                  </AppInline>
                </AppStack>
              </AppStack>
            </AppCard>
          </AppGrid>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Estado del sistema"
                description="Comprobación de infraestructura base."
              />
            }
          >
            <AppAlert
              tone={synced ? "success" : "warning"}
              title={synced ? "Todo funcionando" : "Sincronización pendiente"}
            >
              AppSafeArea, viewport, ScrollView y componentes responsive están
              funcionando dentro del nuevo layout.
            </AppAlert>

            <AppInline gap="md" wrap>
              <AppButton leadingIcon={RefreshCw} onPress={handleRefresh}>
                Actualizar
              </AppButton>

              <AppButton
                variant="outlined"
                tone="neutral"
                leadingIcon={Activity}
                onPress={() => {
                  setSynced((current) => !current);
                }}
              >
                Alternar estado
              </AppButton>
            </AppInline>
          </AppSection>
        </AppStack>
      </AppScrollScreen>

      <AppToast
        open={toastOpen}
        onOpenChange={setToastOpen}
        message="Acción ejecutada correctamente."
        tone="success"
        position="bottom"
      />
    </>
  );
}
