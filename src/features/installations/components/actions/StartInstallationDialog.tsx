import { CalendarClock, PlayCircle } from "lucide-react-native";

import {
  AppCard,
  AppConfirmDialog,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { InstallationTechnicalDetail } from "../../api/installations.contracts.api";

import { formatInstallationDate } from "../../installations.helpers";

import { InstallationStatusBadge } from "../list/InstallationStatusBadge";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface StartInstallationDialogProps {
  open: boolean;

  installation: InstallationTechnicalDetail;

  loading?: boolean;

  onOpenChange: (open: boolean) => void;

  onConfirm: () => void | Promise<void>;
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function StartInstallationDialog({
  open,
  installation,
  loading = false,
  onOpenChange,
  onConfirm,
}: StartInstallationDialogProps) {
  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Iniciar instalación"
      description="Confirma que comenzarás el trabajo físico de esta instalación."
      icon={PlayCircle}
      tone="info"
      confirmTone="primary"
      confirmLabel="Iniciar trabajo"
      cancelLabel="Cancelar"
      dismissable={!loading}
      onConfirm={onConfirm}
    >
      <AppStack gap="md">
        {/* ===============================================
            INSTALLATION
           =============================================== */}

        <AppCard variant="tonal" radius="md" padding="md">
          <AppStack gap="md">
            <AppInline gap="sm" align="center" justify="space-between" wrap>
              <AppStack gap="xs" flex>
                <AppText variant="bodySmall" tone="secondary">
                  {`Instalación #${installation.id}`}
                </AppText>

                <AppText
                  variant="titleMedium"
                  weight="semibold"
                  numberOfLines={2}
                >
                  {installation.cliente.nombreCompleto || "Cliente sin nombre"}
                </AppText>
              </AppStack>

              <InstallationStatusBadge status={installation.estado} />
            </AppInline>

            {/* ===========================================
                PROGRAMACIÓN
               =========================================== */}

            <AppInline gap="sm" align="flex-start">
              <AppIcon icon={CalendarClock} size="sm" tone="muted" decorative />

              <AppStack gap="xs" flex>
                <AppText variant="bodySmall" tone="secondary" weight="medium">
                  Programada para
                </AppText>

                <AppText variant="bodyMedium">
                  {formatInstallationDate(installation.agenda.programadaPara)}
                </AppText>
              </AppStack>
            </AppInline>
          </AppStack>
        </AppCard>

        {/* ===============================================
            EXPLANATION
           =============================================== */}

        <AppText variant="bodySmall" tone="secondary">
          Al confirmar, el servidor registrará el inicio del trabajo y
          actualizará el estado operativo de la instalación.
        </AppText>
      </AppStack>
    </AppConfirmDialog>
  );
}
