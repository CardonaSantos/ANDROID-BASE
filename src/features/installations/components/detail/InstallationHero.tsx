import {
  CalendarClock,
  ImageIcon,
  Package,
  Users,
  Wifi,
} from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { InstallationTechnicalDetail } from "../../api/installations.contracts.api";

import {
  formatInstallationDate,
  formatInstallationMoney,
  getInstallationAssignmentLabel,
} from "../../installations.helpers";

import { InstallationStatusBadge } from "../list/InstallationStatusBadge";

import { InstallationTypeBadge } from "../list/InstallationTypeBadge";

export interface InstallationHeroProps {
  installation: InstallationTechnicalDetail;
}

export function InstallationHero({ installation }: InstallationHeroProps) {
  const evidenceCount = installation.evidencias.length;

  const equipmentCount = installation.equipos.length;

  const assignmentLabel = getInstallationAssignmentLabel(
    installation.miAsignacion,
  );

  const service = installation.servicioInternet;

  const workDescription = installation.trabajo.descripcion?.trim();

  return (
    <AppCard
      variant="outlined"
      radius="lg"
      padding="md"
      accessibilityLabel={`Instalación ${installation.id} de ${installation.cliente.nombreCompleto}`}
    >
      <AppStack gap="md">
        {/* ==================================================
            ESTADO / TIPO / ASIGNACIÓN
           ================================================== */}

        <AppInline gap="sm" align="flex-start" justify="space-between" wrap>
          <AppInline gap="xs" align="center" wrap flex>
            <InstallationStatusBadge status={installation.estado} />

            <InstallationTypeBadge type={installation.tipo} />

            {installation.miAsignacion ? (
              <AppBadge
                icon={Users}
                size="sm"
                tone={
                  installation.miAsignacion.esResponsable
                    ? "primary"
                    : "neutral"
                }
                variant="soft"
                accessibilityLabel={`Tu asignación: ${assignmentLabel}`}
              >
                {assignmentLabel}
              </AppBadge>
            ) : null}
          </AppInline>

          <AppInline gap="xs" align="center">
            <AppIcon icon={CalendarClock} size="sm" tone="muted" decorative />

            <AppText variant="bodySmall" tone="secondary">
              {formatInstallationDate(installation.agenda.programadaPara)}
            </AppText>
          </AppInline>
        </AppInline>

        {/* ==================================================
            IDENTIFICADOR
           ================================================== */}

        <AppText variant="bodySmall" tone="secondary" weight="medium">
          {`Instalación #${installation.id}`}
        </AppText>

        {/* ==================================================
            CLIENTE
           ================================================== */}

        <AppStack gap="xs">
          <AppText variant="headlineSmall" weight="semibold">
            {installation.cliente.nombreCompleto || "Cliente sin nombre"}
          </AppText>

          {service ? (
            <AppInline gap="xs" align="center" wrap>
              <AppIcon icon={Wifi} size="sm" tone="primary" decorative />

              <AppText variant="bodyMedium" weight="medium">
                {service.nombre}
              </AppText>

              {service.velocidad ? (
                <AppText variant="bodySmall" tone="secondary">
                  {`· ${service.velocidad}`}
                </AppText>
              ) : null}

              {service.precio !== null ? (
                <AppText variant="bodySmall" tone="secondary">
                  {`· ${formatInstallationMoney(service.precio)}`}
                </AppText>
              ) : null}
            </AppInline>
          ) : (
            <AppText variant="bodySmall" tone="secondary">
              Sin servicio de internet asociado.
            </AppText>
          )}
        </AppStack>

        {/* ==================================================
            DESCRIPCIÓN DEL TRABAJO
           ================================================== */}

        {workDescription ? (
          <AppText variant="bodyMedium" tone="secondary" numberOfLines={4}>
            {workDescription}
          </AppText>
        ) : null}

        {/* ==================================================
            RESUMEN OPERATIVO
           ================================================== */}

        <AppInline gap="xs" align="center" wrap>
          <AppBadge
            icon={ImageIcon}
            size="sm"
            tone={evidenceCount > 0 ? "info" : "neutral"}
            variant="soft"
            accessibilityLabel={`${evidenceCount} evidencias`}
          >
            {`${evidenceCount} evidencia${evidenceCount === 1 ? "" : "s"}`}
          </AppBadge>

          <AppBadge
            icon={Package}
            size="sm"
            tone="neutral"
            variant="soft"
            accessibilityLabel={`${equipmentCount} equipos`}
          >
            {`${equipmentCount} equipo${equipmentCount === 1 ? "" : "s"}`}
          </AppBadge>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}
