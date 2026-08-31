import { RefreshCw } from "lucide-react-native";

import { useRouter } from "expo-router";

import {
  AppAlert,
  AppButton,
  AppGrid,
  AppInline,
  AppScrollScreen,
  AppStack,
  AppText,
} from "@/design-system";

import { useLogoutMutation } from "@/features/auth";

import { useTechnicianPanelQuery } from "../hooks";

import { formatTechnicianPanelPeriod } from "../presentation";

import { TechnicianActivitySummaryCard } from "./TechnicianActivitySummaryCard";

import { TechnicianJourneyCard } from "./TechnicianJourneyCard";

import { TechnicianProductivityCard } from "./TechnicianProductivityCard";

import { TechnicianQuickActions } from "./TechnicianQuickActions";

import { TechnicianTimesCard } from "./TechnicianTimesCard";

import { TechnicianWorkloadCard } from "./TechnicianWorkloadCard";
import { TechnicianActivityChart } from "./charts/TechnicianActivityChart";

export function TechnicianDashboardScreen() {
  const router = useRouter();

  const panelQuery = useTechnicianPanelQuery();

  const logoutMutation = useLogoutMutation();

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

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

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

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

  /*
   * =========================================================
   * CONTENT
   * =========================================================
   */

  return (
    <AppScrollScreen>
      <AppStack gap="2xl">
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <AppInline gap="md" align="center" justify="space-between" wrap>
          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              {panel.tecnico.nombre}
            </AppText>

            <AppText variant="bodySmall" tone="muted">
              {formatTechnicianPanelPeriod(panel.periodo)}
            </AppText>
          </AppStack>

          <AppButton
            size="sm"
            variant="outlined"
            tone="neutral"
            leadingIcon={RefreshCw}
            loading={panelQuery.isFetching}
            onPress={() => {
              void panelQuery.refetch();
            }}
          >
            Refresh
          </AppButton>
        </AppInline>

        {/* ========================================= */}
        {/* JORNADA / GPS */}
        {/* ========================================= */}

        <TechnicianJourneyCard
          onOpen={() => {
            router.push("/tracking");
          }}
        />

        {/* ========================================= */}
        {/* ACCIONES RÁPIDAS */}
        {/* ========================================= */}

        <TechnicianQuickActions
          workload={panel.cargaActual}
          onOpenTickets={() => {
            router.push("/tickets");
          }}
          onOpenInstallations={() => {
            router.push("/instalaciones");
          }}
        />

        {/* ========================================= */}
        {/* CARGA ACTUAL */}
        {/* ========================================= */}

        <TechnicianWorkloadCard workload={panel.cargaActual} />

        {/* ========================================= */}
        {/* PRODUCTIVIDAD + TIEMPOS */}
        {/* ========================================= */}

        <AppGrid gap="lg" minItemWidth={280}>
          <TechnicianProductivityCard productivity={panel.productividadMes} />

          <TechnicianTimesCard times={panel.tiempos} />
        </AppGrid>

        {/* ========================================= */}
        {/* RESUMEN DE ACTIVIDAD */}
        {/* ========================================= */}

        <TechnicianActivitySummaryCard summary={panel.resumenActividad} />

        {/* ========================================= */}
        {/* GRÁFICA DEL MES */}
        {/* ========================================= */}

        <TechnicianActivityChart activity={panel.actividadDiaria} />

        {/* ========================================= */}
        {/* LOGOUT ERROR */}
        {/* ========================================= */}

        {logoutMutation.isError ? (
          <AppAlert tone="danger" title="No se pudo cerrar la sesión">
            Si tienes una jornada activa o datos pendientes, la aplicación debe
            resolverlos antes de eliminar tu sesión.
          </AppAlert>
        ) : null}

        {/* ========================================= */}
        {/* LOGOUT */}
        {/* ========================================= */}
      </AppStack>
    </AppScrollScreen>
  );
}
