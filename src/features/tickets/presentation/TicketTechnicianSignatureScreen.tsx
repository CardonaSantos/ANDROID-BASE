import { useEffect, useRef, useState } from "react";

import { View } from "react-native";

import { CheckCircle2, RefreshCw, Save } from "lucide-react-native";

import { StyleSheet } from "react-native-unistyles";

import { isAppError } from "@/core/errors";

import {
  AppButton,
  AppCard,
  AppErrorState,
  AppScrollScreen,
  AppStack,
  AppStateView,
  AppText,
  AppTopBar,
  useActionHandler,
} from "@/design-system";

import { TicketSignaturePad } from "../components/signature/TicketSignaturePad";
import type { TicketSignaturePadHandle } from "../components/signature/TicketSignaturePad.types";
import { TicketSignatureSummaryCard } from "../components/signature/TicketSignatureSummaryCard";

import {
  usePrepareTicketConformityMutation,
  useRegisterTechnicianSignatureMutation,
} from "../hooks/ticket-conformity.hooks";

export interface TicketTechnicianSignatureScreenProps {
  ticketId: number;
  onBack: () => void;
  onCompleted: () => void;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return isAppError(error) ? error.message : fallback;
}

export function TicketTechnicianSignatureScreen({
  ticketId,
  onBack,
  onCompleted,
}: TicketTechnicianSignatureScreenProps) {
  const validTicketId = Number.isInteger(ticketId) && ticketId > 0;

  const signatureRef = useRef<TicketSignaturePadHandle | null>(null);
  const preparationStartedRef = useRef(false);

  const [signatureEmpty, setSignatureEmpty] = useState(true);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const prepareMutation = usePrepareTicketConformityMutation(ticketId);
  const registerMutation = useRegisterTechnicianSignatureMutation(ticketId);

  useEffect(() => {
    if (!validTicketId || preparationStartedRef.current) {
      return;
    }

    preparationStartedRef.current = true;
    prepareMutation.mutate();
  }, [prepareMutation.mutate, validTicketId]);

  const conformity = prepareMutation.data ?? null;

  const saveAction = useActionHandler({
    disabled:
      !conformity ||
      conformity.resumen.tieneFirmaTecnico ||
      signatureEmpty ||
      registerMutation.isPending,

    onAction: async () => {
      if (!conformity) {
        throw new Error("No existe una conformidad preparada para el ticket.");
      }

      const file = await signatureRef.current?.captureFile({
        fileName: "firma-tecnico.png",
      });

      if (!file) {
        throw new Error("No fue posible generar el archivo de firma.");
      }

      return registerMutation.mutateAsync({
        conformityId: conformity.id,
        file,
      });
    },

    successFeedback: {
      haptic: "success",
      announcement: "Firma técnica registrada correctamente.",
    },

    errorFeedback: {
      haptic: "error",
      announcement: "No se pudo registrar la firma técnica.",
    },

    onSuccess: () => {
      setCompleted(true);
    },

    onError: (error) => {
      setSignatureError(
        getErrorMessage(error, "No fue posible registrar la firma técnica."),
      );
    },
  });

  const retryPreparation = () => {
    preparationStartedRef.current = true;
    prepareMutation.reset();
    prepareMutation.mutate();
  };

  if (!validTicketId) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Firma técnica"
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
          title="Firma técnica"
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
            title="Firma técnica registrada"
            description="La firma quedó asociada al ciclo de conformidad del ticket."
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
          title="Firma técnica"
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
            title="Preparando firma"
            description="Validando el ciclo de conformidad del ticket."
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
          title="Firma técnica"
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
            title="No se pudo preparar la firma"
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

  if (conformity.resumen.tieneFirmaTecnico) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Firma técnica"
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
            title="Firma técnica ya registrada"
            description="Este ciclo de conformidad ya contiene la firma del técnico asignado."
            primaryAction={{ label: "Volver al ticket", onPress: onBack }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppTopBar
        title="Firma técnica"
        subtitle={`Ticket #${ticketId}`}
        back
        onBack={onBack}
        safeAreaEdges={[]}
        variant="background"
        divider
      />

      <AppScrollScreen
        safeAreaEdges={[]}
        contentPaddingVertical="md"
        scrollStyle={styles.scroll}
        scrollContentStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AppStack gap="md">
          <TicketSignatureSummaryCard
            conformity={conformity}
            signer="technician"
          />

          <AppCard variant="outlined" radius="lg" padding="md">
            <AppStack gap="md">
              <AppStack gap="xs">
                <AppText variant="titleMedium" weight="semibold">
                  Firma del técnico
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  La identidad del firmante se obtiene del usuario autenticado.
                </AppText>
              </AppStack>

              <TicketSignaturePad
                ref={signatureRef}
                disabled={saveAction.pending || registerMutation.isPending}
                invalid={Boolean(signatureError)}
                error={signatureError ?? undefined}
                onEmptyChange={(isEmpty) => {
                  setSignatureEmpty(isEmpty);

                  if (!isEmpty) {
                    setSignatureError(null);
                    saveAction.resetError();
                  }
                }}
              />

              <AppButton
                size="lg"
                variant="solid"
                tone="primary"
                leadingIcon={Save}
                fullWidth
                loading={saveAction.pending || registerMutation.isPending}
                disabled={signatureEmpty || saveAction.pending || registerMutation.isPending}
                loadingAccessibilityLabel="Guardando firma técnica"
                accessibilityLabel="Guardar firma técnica"
                onPress={() => {
                  if (signatureEmpty) {
                    setSignatureError("Debe registrar su firma antes de continuar.");
                    return;
                  }

                  setSignatureError(null);
                  void saveAction.execute();
                }}
              >
                Guardar firma
              </AppButton>
            </AppStack>
          </AppCard>
        </AppStack>
      </AppScrollScreen>
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
