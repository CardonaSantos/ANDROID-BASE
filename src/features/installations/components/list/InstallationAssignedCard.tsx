import {
  CalendarClock,
  Eye,
  ImageIcon,
  MapPin,
  Package,
  Phone,
  User,
  Users,
  WalletCards,
  Wifi,
} from "lucide-react-native";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  AssignedInstallationListItem,
  InstallationLocation,
} from "../../api/installations.contracts.api";

import {
  formatInstallationMoney,
  formatInstallationShortDate,
  getInstallationAddressText,
  getInstallationAssignmentLabel,
  getInstallationReferenceText,
  hasInstallationCoordinates,
} from "../../installations.helpers";

import { InstallationStatusBadge } from "./InstallationStatusBadge";

import { InstallationTypeBadge } from "./InstallationTypeBadge";

export interface InstallationAssignedCardProps {
  installation: AssignedInstallationListItem;

  onOpenDetails: (installationId: number) => void;

  onCallPhone?: (phone: string) => void | Promise<void>;

  onOpenRoute?: (location: InstallationLocation) => void | Promise<void>;
}

export function InstallationAssignedCard({
  installation,
  onOpenDetails,
  onCallPhone,
  onOpenRoute,
}: InstallationAssignedCardProps) {
  const {
    cliente,
    agenda,
    ubicacion,
    servicioInternet,
    cobro,
    miAsignacion,
    conteos,
  } = installation;

  const address = getInstallationAddressText(ubicacion);

  const reference = getInstallationReferenceText(ubicacion);

  const assignmentLabel = getInstallationAssignmentLabel(miAsignacion);

  const hasCoordinates = hasInstallationCoordinates(ubicacion);

  const canCall = Boolean(cliente.telefono && onCallPhone);

  const canOpenRoute = hasCoordinates && Boolean(onOpenRoute);

  return (
    <AppCard
      variant="outlined"
      radius="lg"
      padding="md"
      accessibilityLabel={`Instalación ${installation.id} de ${cliente.nombreCompleto}`}
    >
      <AppStack gap="md">
        {/* ==================================================
            ESTADO / TIPO / FECHA
           ================================================== */}

        <AppInline gap="sm" align="flex-start" justify="space-between">
          <AppInline gap="xs" align="center" wrap flex>
            <InstallationStatusBadge status={installation.estado} />

            <InstallationTypeBadge type={installation.tipo} />
          </AppInline>

          <AppInline gap="xs" align="center">
            <AppIcon icon={CalendarClock} size="sm" tone="muted" decorative />

            <AppText variant="bodySmall" tone="secondary">
              {formatInstallationShortDate(agenda.programadaPara)}
            </AppText>
          </AppInline>
        </AppInline>

        {/* ==================================================
            CLIENTE
           ================================================== */}

        <AppStack gap="sm">
          <AppInline gap="sm" align="flex-start">
            <AppIcon icon={User} size="sm" tone="muted" decorative />

            <AppStack gap="xs" flex>
              <AppText variant="bodySmall" tone="secondary">
                {`Instalación #${installation.id} · Cliente #${cliente.id}`}
              </AppText>

              <AppText
                variant="titleMedium"
                weight="semibold"
                numberOfLines={2}
              >
                {cliente.nombreCompleto || "Cliente sin nombre"}
              </AppText>
            </AppStack>
          </AppInline>

          {address ? (
            <AppInline gap="sm" align="flex-start">
              <AppIcon icon={MapPin} size="sm" tone="muted" decorative />

              <AppStack gap="xs" flex>
                <AppText variant="bodySmall" tone="secondary" numberOfLines={2}>
                  {address}
                </AppText>

                {reference ? (
                  <AppText
                    variant="bodySmall"
                    tone="secondary"
                    numberOfLines={2}
                  >
                    {`Referencia: ${reference}`}
                  </AppText>
                ) : null}
              </AppStack>
            </AppInline>
          ) : null}
        </AppStack>

        {/* ==================================================
            SERVICIO
           ================================================== */}

        <AppCard variant="tonal" radius="md" padding="sm">
          <AppInline gap="sm" align="center">
            <AppIcon icon={Wifi} size="sm" tone="primary" decorative />

            <AppStack gap="xs" flex>
              <AppText variant="bodySmall" tone="secondary">
                Servicio
              </AppText>

              {servicioInternet ? (
                <>
                  <AppText
                    variant="bodyMedium"
                    weight="semibold"
                    numberOfLines={1}
                  >
                    {servicioInternet.nombre}
                  </AppText>

                  <AppText
                    variant="bodySmall"
                    tone="secondary"
                    numberOfLines={1}
                  >
                    {[
                      servicioInternet.velocidad,
                      servicioInternet.precio !== null
                        ? formatInstallationMoney(servicioInternet.precio)
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </AppText>
                </>
              ) : (
                <AppText variant="bodyMedium" tone="secondary">
                  Sin servicio asignado
                </AppText>
              )}
            </AppStack>
          </AppInline>
        </AppCard>

        {/* ==================================================
            ASIGNACIÓN
           ================================================== */}

        <AppInline gap="sm" align="center" justify="space-between" wrap>
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={Users} size="sm" tone="muted" decorative />

            <AppStack gap="xs" flex>
              <AppText variant="bodySmall" tone="secondary">
                Mi asignación
              </AppText>

              <AppText
                variant="bodyMedium"
                weight={miAsignacion.esResponsable ? "semibold" : "regular"}
              >
                {assignmentLabel}
              </AppText>
            </AppStack>
          </AppInline>

          {miAsignacion.esResponsable ? (
            <AppBadge size="sm" tone="primary" variant="soft">
              Responsable
            </AppBadge>
          ) : null}
        </AppInline>

        {/* ==================================================
            CONTEOS
           ================================================== */}

        <AppInline gap="xs" align="center" wrap>
          <AppBadge
            icon={Users}
            size="sm"
            tone="neutral"
            variant="soft"
            accessibilityLabel={`${conteos.tecnicos} técnicos asignados`}
          >
            {conteos.tecnicos}
          </AppBadge>

          <AppBadge
            icon={ImageIcon}
            size="sm"
            tone="info"
            variant="soft"
            accessibilityLabel={`${conteos.evidencias} evidencias`}
          >
            {conteos.evidencias}
          </AppBadge>

          <AppBadge
            icon={Package}
            size="sm"
            tone="neutral"
            variant="soft"
            accessibilityLabel={`${conteos.equipos} equipos`}
          >
            {conteos.equipos}
          </AppBadge>
        </AppInline>

        {/* ==================================================
            COBRO
           ================================================== */}

        <AppCard variant="tonal" radius="md" padding="sm">
          <AppInline gap="sm" align="center" justify="space-between">
            <AppInline gap="sm" align="center" flex>
              <AppIcon
                icon={WalletCards}
                size="sm"
                tone={cobro.pendienteCobrar > 0 ? "warning" : "success"}
                decorative
              />

              <AppStack gap="xs" flex>
                <AppText variant="bodySmall" tone="secondary">
                  Pendiente de cobro
                </AppText>

                <AppText
                  variant="titleMedium"
                  weight="semibold"
                  tone={cobro.pendienteCobrar > 0 ? "warning" : "success"}
                >
                  {formatInstallationMoney(cobro.pendienteCobrar)}
                </AppText>
              </AppStack>
            </AppInline>

            <AppStack gap="xs" align="flex-end">
              <AppText variant="bodySmall" tone="secondary">
                Cobrado
              </AppText>

              <AppText variant="bodySmall" weight="semibold">
                {formatInstallationMoney(cobro.montoCobradoCliente)}
              </AppText>
            </AppStack>
          </AppInline>
        </AppCard>

        {/* ==================================================
            ACCIONES RÁPIDAS
           ================================================== */}

        <AppGrid gap="sm" minItemWidth={130}>
          {canCall && cliente.telefono ? (
            <AppButton
              size="md"
              variant="outlined"
              tone="neutral"
              leadingIcon={Phone}
              fullWidth
              accessibilityLabel={`Llamar a ${cliente.nombreCompleto}`}
              onPress={() => {
                void onCallPhone?.(cliente.telefono!);
              }}
            >
              Llamar
            </AppButton>
          ) : null}

          {canOpenRoute ? (
            <AppButton
              size="md"
              variant="outlined"
              tone="neutral"
              leadingIcon={MapPin}
              fullWidth
              accessibilityLabel={`Abrir ruta hacia la instalación ${installation.id}`}
              onPress={() => {
                void onOpenRoute?.(ubicacion);
              }}
            >
              Ruta
            </AppButton>
          ) : null}

          <AppButton
            size="md"
            variant="solid"
            tone="primary"
            leadingIcon={Eye}
            fullWidth
            accessibilityLabel={`Ver detalle de la instalación ${installation.id}`}
            onPress={() => {
              onOpenDetails(installation.id);
            }}
          >
            Ver detalles
          </AppButton>
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
