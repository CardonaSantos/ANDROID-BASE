import { LogOut, RefreshCw } from "lucide-react-native";

import { useRouter } from "expo-router";

import {
  AppAlert,
  AppButton,
  AppInline,
  AppScrollScreen,
  AppStack,
  AppText,
} from "@/design-system";

import { useLogoutMutation } from "@/features/auth";

import { useTechnicianPanelQuery } from "../hooks";

import {
  formatTechnicianPanelPeriod,
  getTechnicianPendingWork,
} from "../presentation";

import { TechnicianActivityCard } from "./TechnicianActivityCard";

import { TechnicianJourneyCard } from "./TechnicianJourneyCard";

import { TechnicianPerformanceCard } from "./TechnicianPerformanceCard";

import { TechnicianQuickActions } from "./TechnicianQuickActions";

import { TechnicianWorkloadCard } from "./TechnicianWorkloadCard";

export function TechnicianDashboardScreen() {
  const router = useRouter();

  const panelQuery = useTechnicianPanelQuery();

  const logoutMutation = useLogoutMutation();

  if (panelQuery.isPending) {
    return (
      <AppScrollScreen>
        <AppStack gap="lg">
          <AppText variant="headlineSmall" weight="semibold">
            Panel técnico
          </AppText>

          <AppText tone="muted">Cargando información operativa...</AppText>
        </AppStack>
      </AppScrollScreen>
    );
  }

  if (panelQuery.isError || !panelQuery.data) {
    return (
      <AppScrollScreen>
        <AppStack gap="lg">
          <AppAlert tone="danger" title="No se pudo cargar el panel técnico">
            Revisa tu conexión o intenta nuevamente.
          </AppAlert>

          <AppButton
            variant="outlined"
            tone="neutral"
            leadingIcon={RefreshCw}
            loading={panelQuery.isFetching}
            onPress={() => {
              void panelQuery.refetch();
            }}
          >
            Reintentar
          </AppButton>
        </AppStack>
      </AppScrollScreen>
    );
  }

  const panel = panelQuery.data;

  const pendingWork = getTechnicianPendingWork(panel.cargaActual);

  return (
    <AppScrollScreen>
      <AppStack gap="2xl">
        <AppInline gap="md" align="center">
          <AppStack gap="xs" flex>
            <AppText variant="headlineSmall" weight="semibold">
              Panel técnico
            </AppText>

            <AppText variant="titleMedium" weight="semibold">
              {panel.tecnico.nombre}
            </AppText>

            <AppText variant="bodySmall" tone="muted">
              {formatTechnicianPanelPeriod(panel.periodo)}
            </AppText>
          </AppStack>

          <AppButton
            variant="outlined"
            tone="neutral"
            leadingIcon={RefreshCw}
            loading={panelQuery.isFetching}
            onPress={() => {
              void panelQuery.refetch();
            }}
          >
            Actualizar
          </AppButton>
        </AppInline>

        <AppAlert
          tone={pendingWork > 0 ? "info" : "neutral"}
          title="Trabajo asignado"
        >
          {pendingWork > 0
            ? `Tienes ${pendingWork} trabajos pendientes entre tickets e instalaciones.`
            : "No tienes trabajos pendientes actualmente."}
        </AppAlert>

        <TechnicianJourneyCard
          onOpen={() => {
            router.push("/tracking");
          }}
        />

        <TechnicianQuickActions
          workload={panel.cargaActual}
          onOpenTickets={() => {
            router.push("/tickets");
          }}
          onOpenInstallations={() => {
            router.push("/instalaciones");
          }}
        />

        <TechnicianWorkloadCard workload={panel.cargaActual} />

        <TechnicianPerformanceCard
          productivity={panel.productividadMes}
          times={panel.tiempos}
        />

        <TechnicianActivityCard
          summary={panel.resumenActividad}
          activity={panel.actividadDiaria}
        />

        {logoutMutation.isError ? (
          <AppAlert tone="danger" title="No se pudo cerrar la sesión">
            Si tienes una jornada activa o datos pendientes, la aplicación debe
            resolverlos antes de eliminar tu sesión.
          </AppAlert>
        ) : null}

        <AppButton
          variant="outlined"
          tone="neutral"
          leadingIcon={LogOut}
          loading={logoutMutation.isPending}
          onPress={() => {
            logoutMutation.mutate();
          }}
        >
          Cerrar sesión
        </AppButton>
      </AppStack>
    </AppScrollScreen>
  );
}
