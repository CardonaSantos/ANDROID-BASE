import { useCallback, useEffect, useRef, useState } from "react";

import { View } from "react-native";

import { CheckCircle2, RefreshCw, Save } from "lucide-react-native";

import { StyleSheet } from "react-native-unistyles";

import { isAppError } from "@/core/errors";

import {
  AppAlert,
  AppButton,
  AppCard,
  AppErrorState,
  AppInput,
  AppKeyboardScreen,
  AppStack,
  AppStateView,
  AppText,
  AppTopBar,
  useActionHandler,
} from "@/design-system";

import type { GenerateTicketConformityLinkResponse } from "../api/ticket-conformity.contracts.api";

import { isHttpStatus } from "../application/ticket-conformity.actions";
import {
  ticketClientSignatureIdentitySchema,
  type TicketClientSignatureIdentity,
} from "../application/ticket-conformity.validation";

import { TicketSignaturePad } from "../components/signature/TicketSignaturePad";
import type { TicketSignaturePadHandle } from "../components/signature/TicketSignaturePad.types";
import { TicketSignatureSummaryCard } from "../components/signature/TicketSignatureSummaryCard";

import {
  useGenerateTicketConformityLinkMutation,
  usePrepareTicketConformityMutation,
  useRegisterClientSignatureMutation,
} from "../hooks/ticket-conformity.hooks";

export interface TicketClientSignatureScreenProps {
  ticketId: number;
  onBack: () => void;
  onCompleted: () => void;
}

interface ClientFieldErrors {
  nombreFirmante?: string;
  telefonoFirmante?: string;
  firma?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return isAppError(error) ? error.message : fallback;
}

function getFieldErrors(error: ReturnType<typeof ticketClientSignatureIdentitySchema.safeParse>): ClientFieldErrors {
  if (error.success) {
    return {};
  }

  const fields = error.error.flatten().fieldErrors;

  return {
    nombreFirmante: fields.nombreFirmante?.[0],
    telefonoFirmante: fields.telefonoFirmante?.[0],
  };
}

export function TicketClientSignatureScreen({
  ticketId,
  onBack,
  onCompleted,
}: TicketClientSignatureScreenProps) {
  const validTicketId = Number.isInteger(ticketId) && ticketId > 0;

  const signatureRef = useRef<TicketSignaturePadHandle | null>(null);
  const preparationStartedRef = useRef(false);
  const linkStartedForConformityRef = useRef<number | null>(null);
  const identityInitializedRef = useRef(false);

  const [signatureEmpty, setSignatureEmpty] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<ClientFieldErrors>({});
  const [nombreFirmante, setNombreFirmante] = useState("");
  const [telefonoFirmante, setTelefonoFirmante] = useState("");
  const [signingLink, setSigningLink] =
    useState<GenerateTicketConformityLinkResponse | null>(null);
  const [completed, setCompleted] = useState(false);

  const prepareMutation = usePrepareTicketConformityMutation(ticketId);
  const generateLinkMutation = useGenerateTicketConformityLinkMutation();
  const registerMutation = useRegisterClientSignatureMutation(ticketId);

  useEffect(() => {
    if (!validTicketId || preparationStartedRef.current) {
      return;
    }

    preparationStartedRef.current = true;
    prepareMutation.mutate();
  }, [prepareMutation.mutate, validTicketId]);

  const conformity = prepareMutation.data ?? null;

  useEffect(() => {
    if (!conformity || identityInitializedRef.current) {
      return;
    }

    identityInitializedRef.current = true;
    setNombreFirmante(conformity.cliente?.nombreCompleto?.trim() ?? "");
    setTelefonoFirmante(conformity.cliente?.telefono?.trim() ?? "");
  }, [conformity]);

  const generateSigningLink = useCallback(async () => {
    if (!conformity) {
      throw new Error("No existe una conformidad preparada para el ticket.");
    }

    const link = await generateLinkMutation.mutateAsync({
      conformityId: conformity.id,
      input: {
        canal: "LINK",
      },
    });

    setSigningLink(link);
    return link;
  }, [conformity, generateLinkMutation.mutateAsync]);

  useEffect(() => {
    if (
      !conformity ||
      conformity.resumen.tieneFirmaCliente ||
      signingLink ||
      generateLinkMutation.isPending ||
      linkStartedForConformityRef.current === conformity.id
    ) {
      return;
    }

    linkStartedForConformityRef.current = conformity.id;

    void generateSigningLink().catch(() => {
      /* El estado de error de la mutación se presenta abajo. */
    });
  }, [
    conformity,
    generateLinkMutation.isPending,
    generateSigningLink,
    signingLink,
  ]);

  const submitAction = useActionHandler<[TicketClientSignatureIdentity], unknown>({
    disabled:
      !conformity ||
      !signingLink ||
      signatureEmpty ||
      registerMutation.isPending ||
      generateLinkMutation.isPending,

    onAction: async (identity) => {
      if (!conformity || !signingLink) {
        throw new Error("La sesión de firma todavía no está lista.");
      }

      const file = await signatureRef.current?.captureFile({
        fileName: "firma-cliente.png",
      });

      if (!file) {
        throw new Error("No fue posible generar el archivo de firma.");
      }

      const submitWithToken = (token: string) =>
        registerMutation.mutateAsync({
          token,
          nombreFirmante: identity.nombreFirmante,
          telefonoFirmante: identity.telefonoFirmante,
          file,
        });

      try {
        return await submitWithToken(signingLink.token);
      } catch (error) {
        /*
         * Mejora respecto al CRM Web:
         * si el token expiró mientras el cliente estaba firmando, regeneramos
         * uno y reenviamos LA MISMA captura. No obligamos a firmar otra vez.
         */
        if (!isHttpStatus(error, 404) && !isHttpStatus(error, 410)) {
          throw error;
        }

        const refreshedLink = await generateSigningLink();
        return submitWithToken(refreshedLink.token);
      }
    },

    successFeedback: {
      haptic: "success",
      announcement: "Firma del cliente registrada correctamente.",
    },

    errorFeedback: {
      haptic: "error",
      announcement: "No se pudo registrar la firma del cliente.",
    },

    onSuccess: () => {
      setCompleted(true);
    },

    onError: (error) => {
      setFieldErrors((current) => ({
        ...current,
        firma: getErrorMessage(
          error,
          "No fue posible registrar la conformidad del cliente.",
        ),
      }));
    },
  });

  const retryPreparation = () => {
    preparationStartedRef.current = true;
    identityInitializedRef.current = false;
    linkStartedForConformityRef.current = null;
    setSigningLink(null);
    prepareMutation.reset();
    prepareMutation.mutate();
  };

  const retryLink = () => {
    if (!conformity) {
      return;
    }

    generateLinkMutation.reset();
    linkStartedForConformityRef.current = conformity.id;

    void generateSigningLink().catch(() => undefined);
  };

  const handleSubmit = () => {
    const validation = ticketClientSignatureIdentitySchema.safeParse({
      nombreFirmante,
      telefonoFirmante,
    });

    const nextErrors = getFieldErrors(validation);

    if (signatureEmpty) {
      nextErrors.firma = "La firma es obligatoria.";
    }

    setFieldErrors(nextErrors);

    if (!validation.success || signatureEmpty) {
      return;
    }

    void submitAction.execute(validation.data);
  };

  if (!validTicketId) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Firma del cliente"
          subtitle="Ticket inválido"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="Ticket inválido"
            description="El identificador recibido no corresponde a un ticket válido."
            primaryAction={{ label: "Volver", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  if (completed) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Firma del cliente"
          subtitle={`Ticket #${ticketId}`}
          back
          onBack={onCompleted}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppStateView
            fill
            icon={CheckCircle2}
            tone="success"
            title="Conformidad registrada"
            description="La firma del cliente quedó guardada y el ciclo fue marcado como conforme."
            primaryAction={{
              label: "Volver al ticket",
              onPress: onCompleted,
            }}
            announceOnMount
          />
        </View>
      </View>
    );
  }

  if (prepareMutation.isPending || (!prepareMutation.data && !prepareMutation.isError)) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Firma del cliente"
          subtitle={`Ticket #${ticketId}`}
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
            title="Preparando conformidad"
            description="Validando el ciclo del ticket antes de capturar la firma."
            announceOnMount
          />
        </View>
      </View>
    );
  }

  if (prepareMutation.isError || !conformity) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Firma del cliente"
          subtitle={`Ticket #${ticketId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="No se pudo preparar la conformidad"
            description={getErrorMessage(
              prepareMutation.error,
              "Revisa la conexión e intenta nuevamente.",
            )}
            primaryAction={{
              label: "Reintentar",
              icon: RefreshCw,
              loading: prepareMutation.isPending,
              onPress: retryPreparation,
            }}
            secondaryAction={{ label: "Volver", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  if (conformity.resumen.tieneFirmaCliente) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Firma del cliente"
          subtitle={`Ticket #${ticketId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppStateView
            fill
            icon={CheckCircle2}
            tone="success"
            title="Cliente ya conforme"
            description="Este ciclo ya contiene una firma del cliente."
            primaryAction={{ label: "Volver al ticket", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  if (generateLinkMutation.isError || !signingLink) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Firma del cliente"
          subtitle={`Ticket #${ticketId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          {generateLinkMutation.isPending ? (
            <AppStateView
              fill
              tone="primary"
              title="Preparando sesión de firma"
              description="Generando una autorización temporal sin salir de la aplicación."
            />
          ) : (
            <AppErrorState
              fill
              title="No se pudo preparar la sesión de firma"
              description={getErrorMessage(
                generateLinkMutation.error,
                "No fue posible generar la autorización temporal para el cliente.",
              )}
              primaryAction={{
                label: "Reintentar",
                icon: RefreshCw,
                loading: generateLinkMutation.isPending,
                onPress: retryLink,
              }}
              secondaryAction={{ label: "Volver", onPress: onBack }}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppTopBar
        title="Firma del cliente"
        subtitle={`Ticket #${ticketId}`}
        back
        onBack={onBack}
        safeAreaEdges={[]}
        variant="background"
        divider
      />

      <AppKeyboardScreen
        safeAreaEdges={[]}
        contentPaddingVertical="md"
        scrollStyle={styles.scroll}
        scrollContentStyle={styles.scrollContent}
      >
        <AppStack gap="md">
          <TicketSignatureSummaryCard conformity={conformity} signer="client" />

          <AppAlert tone="info" title="Firma presencial">
            La autorización temporal se gestiona internamente. No se abrirá un
            navegador ni se mostrará un enlace al cliente.
          </AppAlert>

          <AppCard variant="outlined" radius="lg" padding="md">
            <AppStack gap="md">
              <AppStack gap="xs">
                <AppText variant="titleMedium" weight="semibold">
                  Datos del firmante
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  Confirma los datos antes de registrar la conformidad.
                </AppText>
              </AppStack>

              <AppInput
                label="Nombre completo"
                required
                value={nombreFirmante}
                onChangeText={(value) => {
                  setNombreFirmante(value);
                  setFieldErrors((current) => ({ ...current, nombreFirmante: undefined }));
                }}
                error={fieldErrors.nombreFirmante}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!submitAction.pending}
              />

              <AppInput
                label="Teléfono"
                required
                value={telefonoFirmante}
                onChangeText={(value) => {
                  setTelefonoFirmante(value);
                  setFieldErrors((current) => ({ ...current, telefonoFirmante: undefined }));
                }}
                error={fieldErrors.telefonoFirmante}
                keyboardType="phone-pad"
                autoCorrect={false}
                editable={!submitAction.pending}
              />
            </AppStack>
          </AppCard>

          <AppCard variant="outlined" radius="lg" padding="md">
            <AppStack gap="md">
              <AppStack gap="xs">
                <AppText variant="titleMedium" weight="semibold">
                  Firma del cliente
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  La firma se almacena como imagen PNG asociada al ticket.
                </AppText>
              </AppStack>

              <TicketSignaturePad
                ref={signatureRef}
                disabled={submitAction.pending || registerMutation.isPending}
                invalid={Boolean(fieldErrors.firma)}
                error={fieldErrors.firma}
                onEmptyChange={(isEmpty) => {
                  setSignatureEmpty(isEmpty);

                  if (!isEmpty) {
                    setFieldErrors((current) => ({ ...current, firma: undefined }));
                    submitAction.resetError();
                  }
                }}
              />

              <AppButton
                size="lg"
                variant="solid"
                tone="success"
                leadingIcon={Save}
                fullWidth
                loading={
                  submitAction.pending ||
                  registerMutation.isPending ||
                  generateLinkMutation.isPending
                }
                disabled={submitAction.pending || registerMutation.isPending}
                loadingAccessibilityLabel="Registrando conformidad del cliente"
                accessibilityLabel="Confirmar firma del cliente"
                onPress={handleSubmit}
              >
                Confirmar y guardar
              </AppButton>
            </AppStack>
          </AppCard>
        </AppStack>
      </AppKeyboardScreen>
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
    paddingBottom: theme.spacing["2xl"],
  },
}));
