import { Clock, StickyNote, User, Users } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  InstallationTechnicalDetail,
  InstallationTechnicalParticipant,
} from "../../api/installations.contracts.api";

import {
  Banknote,
  Package,
  Receipt,
  WalletCards,
  Wrench,
} from "lucide-react-native";
import { formatEnumLabel } from "../../installations.helpers";

export interface InstallationParticipantsSectionProps {
  installation: InstallationTechnicalDetail;
}

/*
 * =========================================================
 * TIME
 * =========================================================
 */

function formatParticipantTime(minutes: number | null): string {
  if (minutes === null || minutes <= 0) {
    return "Sin tiempo registrado";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}

/*
 * =========================================================
 * PARTICIPANT CARD
 * =========================================================
 */

interface ParticipantCardProps {
  participant: InstallationTechnicalParticipant;
}

function ParticipantCard({ participant }: ParticipantCardProps) {
  const roleLabel = participant.esResponsable
    ? "Responsable"
    : formatEnumLabel(participant.rol);

  return (
    <AppCard variant="tonal" radius="md" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            IDENTIDAD
           =============================================== */}

        <AppInline gap="sm" align="flex-start" justify="space-between" wrap>
          <AppInline gap="sm" align="flex-start" flex>
            <AppIcon
              icon={User}
              size="sm"
              tone={participant.esResponsable ? "primary" : "muted"}
              decorative
            />

            <AppStack gap="xs" flex>
              <AppText
                variant="titleMedium"
                weight="semibold"
                numberOfLines={2}
              >
                {participant.nombre || "Técnico sin nombre"}
              </AppText>

              <AppText variant="bodySmall" tone="secondary">
                {participant.tecnicoId
                  ? `Técnico #${participant.tecnicoId}`
                  : "Sin técnico vinculado"}
              </AppText>
            </AppStack>
          </AppInline>

          <AppBadge
            size="sm"
            tone={participant.esResponsable ? "primary" : "neutral"}
            variant="soft"
            accessibilityLabel={`Rol: ${roleLabel}`}
          >
            {roleLabel}
          </AppBadge>
        </AppInline>

        {/* ===============================================
            DATOS DE ASIGNACIÓN
           =============================================== */}

        <AppGrid gap="md" minItemWidth={140}>
          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Asignación
            </AppText>

            <AppText variant="bodyMedium">
              {`#${participant.asignacionId}`}
            </AppText>
          </AppStack>

          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Rol
            </AppText>

            <AppText variant="bodyMedium">
              {formatEnumLabel(participant.rol)}
            </AppText>
          </AppStack>

          <AppStack gap="xs">
            <AppInline gap="xs" align="center">
              <AppIcon icon={Clock} size="sm" tone="muted" decorative />

              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Tiempo
              </AppText>
            </AppInline>

            <AppText variant="bodyMedium">
              {formatParticipantTime(participant.tiempoMinutos)}
            </AppText>
          </AppStack>
        </AppGrid>

        {/* ===============================================
            OBSERVACIONES
           =============================================== */}

        {participant.observaciones ? (
          <AppCard variant="outlined" radius="md" padding="sm">
            <AppInline gap="sm" align="flex-start">
              <AppIcon icon={StickyNote} size="sm" tone="muted" decorative />

              <AppStack gap="xs" flex>
                <AppText variant="bodySmall" tone="secondary" weight="medium">
                  Observaciones
                </AppText>

                <AppText variant="bodySmall">
                  {participant.observaciones}
                </AppText>
              </AppStack>
            </AppInline>
          </AppCard>
        ) : null}
      </AppStack>
    </AppCard>
  );
}

/*
 * =========================================================
 * SECTION
 * =========================================================
 */

export function InstallationParticipantsSection({
  installation,
}: InstallationParticipantsSectionProps) {
  const participants = installation.participantes;

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="center">
          <AppIcon icon={Users} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Participantes
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              Técnicos asignados al trabajo.
            </AppText>
          </AppStack>

          {participants.length > 0 ? (
            <AppBadge
              size="sm"
              tone="neutral"
              variant="soft"
              accessibilityLabel={`${participants.length} participantes`}
            >
              {`${participants.length}`}
            </AppBadge>
          ) : null}
        </AppInline>

        {/* ===============================================
            PARTICIPANTES
           =============================================== */}

        {participants.length === 0 ? (
          <AppCard variant="tonal" radius="md" padding="md">
            <AppText variant="bodyMedium" tone="secondary">
              No hay participantes registrados para esta instalación.
            </AppText>
          </AppCard>
        ) : (
          <AppStack gap="md">
            {participants.map((participant) => (
              <ParticipantCard
                key={participant.asignacionId}
                participant={participant}
              />
            ))}
          </AppStack>
        )}
      </AppStack>
    </AppCard>
  );
}

import { formatInstallationMoney } from "../../installations.helpers";

export interface InstallationCostsSectionProps {
  installation: InstallationTechnicalDetail;
}

/*
 * =========================================================
 * COST ITEM
 * =========================================================
 */

interface CostItemProps {
  label: string;

  value: number;

  icon: typeof Banknote;
}

function CostItem({ label, value, icon }: CostItemProps) {
  return (
    <AppCard variant="tonal" radius="md" padding="sm">
      <AppInline gap="sm" align="center">
        <AppIcon icon={icon} size="sm" tone="muted" decorative />

        <AppStack gap="xs" flex>
          <AppText variant="bodySmall" tone="secondary">
            {label}
          </AppText>

          <AppText variant="bodyMedium" weight="semibold">
            {formatInstallationMoney(value)}
          </AppText>
        </AppStack>
      </AppInline>
    </AppCard>
  );
}

/*
 * =========================================================
 * SECTION
 * =========================================================
 */

export function InstallationCostsSection({
  installation,
}: InstallationCostsSectionProps) {
  const plan = installation.servicioInternet?.precio ?? 0;
  const billing = installation.cobro;
  const total =
    installation.cobro.costoInstalacion +
    installation.cobro.costoManoObra +
    installation.cobro.costoMateriales +
    installation.cobro.costoOtros +
    plan;

  const hasPendingBalance = billing.pendienteCobrar > 0;

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="center">
          <AppIcon icon={WalletCards} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Costos
            </AppText>
          </AppStack>
        </AppInline>

        {/* ===============================================
            BREAKDOWN
           =============================================== */}

        <AppGrid gap="sm" minItemWidth={150}>
          <CostItem
            label="Instalación"
            value={billing.costoInstalacion}
            icon={Receipt}
          />

          <CostItem
            label="Materiales"
            value={billing.costoMateriales}
            icon={Package}
          />

          <CostItem
            label="Mano de obra"
            value={billing.costoManoObra}
            icon={Wrench}
          />

          <CostItem label="Otros" value={billing.costoOtros} icon={Banknote} />
        </AppGrid>

        {/* ===============================================
            COBRADO / PENDIENTE
           =============================================== */}

        <AppGrid gap="sm" minItemWidth={180}>
          <AppCard variant="tonal" radius="md" padding="md">
            <AppStack gap="xs">
              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Total
              </AppText>

              <AppText
                variant="titleMedium"
                weight="semibold"
                tone={hasPendingBalance ? "warning" : "success"}
              >
                {formatInstallationMoney(total)}
              </AppText>
            </AppStack>
          </AppCard>
        </AppGrid>

        {/* ===============================================
            NOTAS
           =============================================== */}

        {billing.notas ? (
          <AppCard variant="tonal" radius="md" padding="sm">
            <AppInline gap="sm" align="flex-start">
              <AppIcon icon={StickyNote} size="sm" tone="muted" decorative />

              <AppStack gap="xs" flex>
                <AppText variant="bodySmall" tone="secondary" weight="medium">
                  Notas de costos
                </AppText>

                <AppText variant="bodySmall">{billing.notas}</AppText>
              </AppStack>
            </AppInline>
          </AppCard>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
