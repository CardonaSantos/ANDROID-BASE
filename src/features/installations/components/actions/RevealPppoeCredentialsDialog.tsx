import { Copy, Eye, KeyRound, ShieldAlert } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";

import * as Clipboard from "expo-clipboard";

import type { RevealInstallationPppoeCredentialsResponse } from "../../api/installation-credentials.api";

import { useRevealInstallationPppoeCredentialsMutation } from "../../hooks/installation-credentials.hooks";

import {
  formatEnumLabel,
  formatInstallationDate,
} from "../../installations.helpers";

import {
  AppActionGroup,
  AppBadge,
  AppButton,
  AppCard,
  AppDialog,
  AppDivider,
  AppIcon,
  AppInline,
  AppSnackbar,
  AppStack,
  AppText,
} from "@/design-system";

export interface RevealPppoeCredentialsDialogProps {
  open: boolean;

  installationId: number;

  canReveal: boolean;

  disabledReason?: string | null;

  onOpenChange: (open: boolean) => void;
}

type FeedbackState = {
  message: string;

  tone: "success" | "danger";
};

export function RevealPppoeCredentialsDialog({
  open,
  installationId,
  canReveal,
  disabledReason,
  onOpenChange,
}: RevealPppoeCredentialsDialogProps) {
  const revealMutation = useRevealInstallationPppoeCredentialsMutation();

  /*
   * Esta es la única referencia mantenida por la UI
   * hacia la respuesta que contiene la contraseña.
   *
   * Se elimina al cerrar el diálogo.
   */
  const [response, setResponse] =
    useState<RevealInstallationPppoeCredentialsResponse | null>(null);

  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  /*
   * Permite ignorar una respuesta que llegue después
   * de que el diálogo haya sido cerrado externamente.
   */
  const openRef = useRef(open);

  /*
   * Cada cierre invalida cualquier solicitud anterior.
   *
   * No intenta "borrar memoria" del runtime:
   * simplemente evita conservar una referencia de
   * aplicación hacia la respuesta sensible.
   */
  const requestVersionRef = useRef(0);

  useEffect(() => {
    openRef.current = open;

    if (!open) {
      requestVersionRef.current += 1;

      setResponse(null);

      setFeedback(null);
    }
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      /*
       * La limpieza se hace inmediatamente,
       * sin esperar al siguiente render/effect.
       */
      requestVersionRef.current += 1;

      setResponse(null);

      setFeedback(null);
    }

    onOpenChange(nextOpen);
  };

  const handleReveal = async () => {
    if (!canReveal || revealMutation.isPending) {
      return;
    }

    /*
     * Nueva generación de solicitud.
     *
     * Si el diálogo se cierra mientras espera la
     * respuesta, la versión cambiará y no se
     * almacenará el resultado en state.
     */
    const requestVersion = requestVersionRef.current + 1;

    requestVersionRef.current = requestVersion;

    try {
      const result = await revealMutation.mutateAsync(installationId);

      if (!openRef.current || requestVersionRef.current !== requestVersion) {
        return;
      }

      setResponse(result);
    } catch {
      /*
       * No mostramos el error recibido ni hacemos
       * console.log del mismo en este flujo sensible.
       */
      if (!openRef.current || requestVersionRef.current !== requestVersion) {
        return;
      }

      setFeedback({
        tone: "danger",

        message: "No fue posible revelar las credenciales PPPoE.",
      });
    }
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await Clipboard.setStringAsync(value);

      setFeedback({
        tone: "success",

        message: `${label} copiado al portapapeles.`,
      });
    } catch {
      setFeedback({
        tone: "danger",

        message: `No fue posible copiar ${label.toLowerCase()}.`,
      });
    }
  };

  const credentials = response?.credenciales ?? null;

  const isRevealed = response !== null;

  return (
    <>
      <AppDialog
        open={open}
        onOpenChange={handleOpenChange}
        title={isRevealed ? "Credenciales PPPoE" : "Revelar credenciales PPPoE"}
        icon={isRevealed ? KeyRound : ShieldAlert}
        tone={isRevealed ? "primary" : "warning"}
        size="lg"
        dismissable={!revealMutation.isPending}
        showCloseButton={!revealMutation.isPending}
        scrollable
        actions={
          isRevealed ? (
            <AppActionGroup orientation="auto" align="end">
              <AppButton
                variant="solid"
                tone="primary"
                onPress={() => {
                  handleOpenChange(false);
                }}
              >
                Cerrar
              </AppButton>
            </AppActionGroup>
          ) : (
            <AppActionGroup orientation="horizontal" align="end">
              <AppButton
                size="sm"
                variant="ghost"
                tone="neutral"
                disabled={revealMutation.isPending}
                onPress={() => {
                  handleOpenChange(false);
                }}
              >
                Cancelar
              </AppButton>

              <AppButton
                size="sm"
                variant="solid"
                tone="warning"
                leadingIcon={Eye}
                disabled={!canReveal}
                loading={revealMutation.isPending}
                onPress={() => {
                  void handleReveal();
                }}
              >
                Revelar credenciales
              </AppButton>
            </AppActionGroup>
          )
        }
      >
        {!isRevealed ? (
          <AppStack gap="md">
            <AppCard variant="tonal" radius="md" padding="md">
              <AppStack gap="sm">
                <AppInline align="center" gap="sm">
                  <AppIcon
                    icon={ShieldAlert}
                    size="sm"
                    tone="warning"
                    accessibilityLabel="Información sensible"
                  />

                  <AppText variant="labelSmall" tone="warning">
                    Información sensible
                  </AppText>
                </AppInline>

                <AppText variant="bodySmall" tone="secondary">
                  La contraseña se solicitará únicamente después de confirmar
                  esta acción y se mantendrá solo mientras este diálogo
                  permanezca abierto.
                </AppText>
              </AppStack>
            </AppCard>

            {!canReveal ? (
              <AppCard variant="outlined" radius="md" padding="sm">
                <AppText variant="bodySmall" tone="danger">
                  {disabledReason?.trim() ||
                    "El servidor no permite revelar las credenciales en este momento."}
                </AppText>
              </AppCard>
            ) : null}
          </AppStack>
        ) : credentials && credentials.length > 0 ? (
          <AppStack gap="md">
            {credentials.map((credential, index) => (
              <AppCard
                key={credential.cuentaPppoeId}
                variant="outlined"
                radius="lg"
                padding="md"
              >
                <AppStack gap="md">
                  <AppBadge tone="info" variant="soft" size="sm">
                    {formatEnumLabel(credential.estadoCuenta)}
                  </AppBadge>
                  <AppDivider />

                  <AppStack gap="sm">
                    <AppText variant="labelSmall" tone="default">
                      Usuario
                    </AppText>

                    <AppText variant="titleSmall">{credential.usuario}</AppText>

                    <AppButton
                      variant="outlined"
                      tone="neutral"
                      size="sm"
                      leadingIcon={Copy}
                      onPress={() => {
                        void handleCopy(credential.usuario, "Usuario");
                      }}
                    >
                      Copiar usuario
                    </AppButton>
                  </AppStack>

                  <AppDivider />

                  <AppStack gap="sm">
                    <AppInline align="center" gap="sm">
                      <AppIcon
                        icon={KeyRound}
                        size="sm"
                        tone="warning"
                        accessibilityLabel="Contraseña PPPoE"
                      />

                      <AppText variant="labelSmall" tone="default">
                        Contraseña
                      </AppText>
                    </AppInline>

                    {/*
                     * La contraseña solamente se renderiza
                     * después de la revelación explícita.
                     */}
                    <AppText variant="titleSmall">
                      {credential.contrasena}
                    </AppText>

                    <AppButton
                      variant="solid"
                      tone="warning"
                      size="sm"
                      leadingIcon={Copy}
                      onPress={() => {
                        void handleCopy(credential.contrasena, "Contraseña");
                      }}
                    >
                      Copiar contraseña
                    </AppButton>
                  </AppStack>

                  <AppDivider />

                  <AppStack gap="sm">
                    <AppInline
                      align="center"
                      justify="space-between"
                      gap="sm"
                      wrap
                    >
                      <AppText variant="labelSmall" tone="default">
                        Perfil
                      </AppText>

                      <AppText variant="bodySmall" tone="secondary">
                        {credential.codigoPerfil}
                      </AppText>
                    </AppInline>

                    <AppInline
                      align="center"
                      justify="space-between"
                      gap="sm"
                      wrap
                    >
                      <AppText variant="labelSmall" tone="default">
                        Acceso
                      </AppText>

                      <AppText variant="bodySmall" tone="secondary">
                        #{credential.accesoInternetId}
                      </AppText>
                    </AppInline>

                    <AppInline
                      align="center"
                      justify="space-between"
                      gap="sm"
                      wrap
                    >
                      <AppText variant="labelSmall" tone="default">
                        Router MikroTik
                      </AppText>

                      <AppText variant="bodySmall" tone="secondary">
                        #{credential.mikrotikRouterId}
                      </AppText>
                    </AppInline>

                    <AppInline
                      align="center"
                      justify="space-between"
                      gap="sm"
                      wrap
                    >
                      <AppText variant="labelSmall" tone="default">
                        Perfil homologado
                      </AppText>

                      <AppText variant="bodySmall" tone="secondary">
                        #{credential.perfilHomologacionId}
                      </AppText>
                    </AppInline>

                    <AppInline
                      align="center"
                      justify="space-between"
                      gap="sm"
                      wrap
                    >
                      <AppText variant="labelSmall" tone="default">
                        Servicio
                      </AppText>

                      <AppText variant="bodySmall" tone="secondary">
                        #{credential.servicioInternetId}
                      </AppText>
                    </AppInline>

                    <AppInline
                      align="center"
                      justify="space-between"
                      gap="sm"
                      wrap
                    >
                      <AppText variant="labelSmall" tone="default">
                        Generada
                      </AppText>

                      <AppText variant="bodySmall" tone="secondary">
                        {formatInstallationDate(credential.generadoEn)}
                      </AppText>
                    </AppInline>
                  </AppStack>
                </AppStack>
              </AppCard>
            ))}
          </AppStack>
        ) : (
          <AppCard variant="outlined" radius="md" padding="md">
            <AppStack align="center" gap="sm">
              <AppIcon
                icon={KeyRound}
                size="lg"
                tone="default"
                accessibilityLabel="Sin credenciales PPPoE"
              />

              <AppText variant="titleSmall">
                Sin credenciales disponibles
              </AppText>

              <AppText variant="bodySmall" tone="secondary" align="center">
                El servidor no devolvió credenciales PPPoE para esta
                instalación.
              </AppText>
            </AppStack>
          </AppCard>
        )}
      </AppDialog>

      <AppSnackbar
        open={feedback !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setFeedback(null);
          }
        }}
        message={feedback?.message ?? ""}
        tone={feedback?.tone ?? "success"}
        position="bottom"
      />
    </>
  );
}
