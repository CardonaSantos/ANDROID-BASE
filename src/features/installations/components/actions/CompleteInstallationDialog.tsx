import { CheckCircle2, ClipboardCheck, StickyNote } from "lucide-react-native";

import { useState } from "react";

import {
  AppCard,
  AppConfirmDialog,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
  AppTextArea,
} from "@/design-system";

import type { CompleteInstallationRequest } from "../../api/installations.api";

import type { InstallationTechnicalDetail } from "../../api/installations.contracts.api";

import { InstallationStatusBadge } from "../list/InstallationStatusBadge";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface CompleteInstallationDialogProps {
  open: boolean;

  installation: InstallationTechnicalDetail;

  loading?: boolean;

  onOpenChange: (open: boolean) => void;

  onConfirm: (input: CompleteInstallationRequest) => void | Promise<void>;
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function CompleteInstallationDialog({
  open,
  installation,
  loading = false,
  onOpenChange,
  onConfirm,
}: CompleteInstallationDialogProps) {
  const [result, setResult] = useState("");

  const [observations, setObservations] = useState("");

  /*
   * =======================================================
   * CLOSE / RESET
   * =======================================================
   *
   * El formulario solo se limpia cuando realmente se
   * cierra el diálogo.
   *
   * Si onConfirm falla, AppConfirmDialog permanece abierto
   * y conservamos lo que escribió el técnico.
   * =======================================================
   */

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !loading) {
      setResult("");

      setObservations("");
    }

    onOpenChange(nextOpen);
  };

  /*
   * =======================================================
   * CONFIRM
   * =======================================================
   */

  const handleConfirm = async () => {
    const normalizedResult = result.trim();

    const normalizedObservations = observations.trim();

    await onConfirm({
      resultado: normalizedResult || null,

      observaciones: normalizedObservations || null,
    });
  };

  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Completar instalación"
      description="Confirma que el trabajo físico de esta instalación ha finalizado."
      icon={CheckCircle2}
      tone="success"
      confirmTone="success"
      confirmLabel="Completar instalación"
      cancelLabel="Volver"
      dismissable={!loading}
      onConfirm={handleConfirm}
    >
      <AppStack gap="md">
        {/* ===============================================
            INSTALLATION SUMMARY
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
          </AppStack>
        </AppCard>

        {/* ===============================================
            RESULT
           =============================================== */}

        <AppStack gap="sm">
          <AppInline gap="sm" align="center">
            <AppIcon
              icon={ClipboardCheck}
              size="sm"
              tone="primary"
              decorative
            />

            <AppText variant="bodyMedium" weight="semibold">
              Resultado del trabajo
            </AppText>
          </AppInline>

          <AppTextArea
            label="Resultado"
            description="Resume el trabajo realizado o el resultado final de la instalación."
            placeholder="Ej. Instalación realizada correctamente y conexión verificada."
            value={result}
            onChangeText={setResult}
            minRows={3}
            maxLength={1000}
            showCharacterCount
            disabled={loading}
            accessibilityLabel="Resultado de la instalación"
          />
        </AppStack>

        {/* ===============================================
            OBSERVATIONS
           =============================================== */}

        <AppStack gap="sm">
          <AppInline gap="sm" align="center">
            <AppIcon icon={StickyNote} size="sm" tone="muted" decorative />

            <AppText variant="bodyMedium" weight="semibold">
              Observaciones
            </AppText>
          </AppInline>

          <AppTextArea
            label="Observaciones"
            description="Información adicional que sea útil para soporte o seguimiento."
            placeholder="Ej. Se dejó el router instalado en la sala."
            value={observations}
            onChangeText={setObservations}
            minRows={3}
            maxLength={1000}
            showCharacterCount
            disabled={loading}
            accessibilityLabel="Observaciones de finalización"
          />
        </AppStack>

        {/* ===============================================
            WARNING
           =============================================== */}

        <AppCard variant="outlined" radius="md" padding="sm">
          <AppStack gap="xs">
            <AppText variant="bodySmall" weight="semibold">
              Al completar
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              La instalación quedará registrada como completada. Esta acción
              finaliza únicamente el trabajo técnico y no ejecuta operaciones
              PPPoE ni activa el servicio.
            </AppText>
          </AppStack>
        </AppCard>
      </AppStack>
    </AppConfirmDialog>
  );
}
