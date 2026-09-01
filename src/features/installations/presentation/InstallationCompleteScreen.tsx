import { CheckCircle2, ClipboardCheck, RefreshCw } from "lucide-react-native";

import { useState } from "react";

import { View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppConfirmDialog,
  AppErrorState,
  AppIcon,
  AppInline,
  AppKeyboardScreen,
  AppSnackbar,
  AppStack,
  AppStateView,
  AppText,
  AppTextArea,
  AppTopBar,
} from "@/design-system";

import type { CompleteInstallationRequest } from "../api/installations.api";

import { InstallationStatusBadge } from "../components/list/InstallationStatusBadge";

import { useInstallationTechnicalDetailQuery } from "../hooks/installations.hooks";

import { useCompleteInstallationMutation } from "../hooks/installations.mutations.hooks";

import { formatInstallationDate } from "../installations.helpers";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationCompleteScreenProps {
  installationId: number;

  onBack: () => void;
}

/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export function InstallationCompleteScreen({
  installationId,
  onBack,
}: InstallationCompleteScreenProps) {
  /*
   * =======================================================
   * FORM STATE
   * =======================================================
   */

  const [result, setResult] = useState("");

  const [observations, setObservations] = useState("");

  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);

  /*
   * =======================================================
   * VALIDATION
   * =======================================================
   */

  const hasValidInstallationId =
    Number.isInteger(installationId) && installationId > 0;

  /*
   * =======================================================
   * QUERY
   * =======================================================
   */

  const installationQuery = useInstallationTechnicalDetailQuery(installationId);

  /*
   * =======================================================
   * MUTATION
   * =======================================================
   */

  const completeMutation = useCompleteInstallationMutation();

  /*
   * =======================================================
   * INVALID ID
   * =======================================================
   */

  if (!hasValidInstallationId) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Completar instalación"
          subtitle="Instalación inválida"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="Instalación inválida"
            description="El identificador de la instalación no es válido."
            primaryAction={{
              label: "Volver",

              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * LOADING
   * =======================================================
   */

  if (installationQuery.isPending) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Completar instalación"
          subtitle={`Instalación #${installationId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppStateView
            fill
            icon={ClipboardCheck}
            tone="primary"
            title="Preparando instalación"
            description="Consultando el estado técnico antes de completar el trabajo."
            announceOnMount
          />
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * QUERY ERROR
   * =======================================================
   */

  if (installationQuery.isError) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Completar instalación"
          subtitle={`Instalación #${installationId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="No se pudo cargar la instalación"
            description="Revisa tu conexión e intenta nuevamente."
            primaryAction={{
              label: "Reintentar",

              icon: RefreshCw,

              loading: installationQuery.isFetching,

              onPress: () => {
                void installationQuery.refetch();
              },
            }}
            secondaryAction={{
              label: "Volver",

              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * DATA
   * =======================================================
   */

  const installation = installationQuery.data;

  if (!installation) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Completar instalación"
          subtitle={`Instalación #${installationId}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="Instalación no disponible"
            description="No fue posible obtener la información de la instalación."
            primaryAction={{
              label: "Volver",

              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * COMPLETED LOCAL STATE
   * =======================================================
   *
   * No navegamos automáticamente.
   *
   * Dejamos que el técnico vea claramente que la
   * operación terminó antes de regresar al detalle.
   * =======================================================
   */

  if (completed) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Completar instalación"
          subtitle={`Instalación #${installation.id}`}
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
            title="Instalación completada"
            description="El trabajo técnico fue marcado como completado correctamente."
            primaryAction={{
              label: "Volver al detalle",

              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * SERVER AUTHORITY
   * =======================================================
   *
   * La ruta puede abrirse directamente.
   *
   * Por eso volvemos a comprobar acciones.completar
   * y no confiamos únicamente en la navegación previa.
   * =======================================================
   */

  const completeAction = installation.acciones.completar;

  if (!completeAction.habilitada) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Completar instalación"
          subtitle={`Instalación #${installation.id}`}
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppErrorState
            fill
            title="No se puede completar"
            description={
              completeAction.motivo ||
              "El servidor no permite completar esta instalación en este momento."
            }
            primaryAction={{
              label: "Volver al detalle",

              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * OPEN CONFIRMATION
   * =======================================================
   */

  const handleRequestComplete = () => {
    if (completeMutation.isPending) {
      return;
    }

    setFeedback(null);

    setConfirmationOpen(true);
  };

  /*
   * =======================================================
   * COMPLETE
   * =======================================================
   */

  const handleConfirmComplete = async () => {
    /*
     * El detalle pudo cambiar después de abrir
     * esta pantalla.
     *
     * La API seguirá validando la operación en
     * servidor; aquí evitamos ejecutar cuando nuestro
     * último detalle ya indica que está bloqueada.
     */

    if (!installation.acciones.completar.habilitada) {
      setFeedback(
        installation.acciones.completar.motivo ||
          "El servidor ya no permite completar esta instalación.",
      );

      throw new Error("Installation completion is no longer enabled.");
    }

    const normalizedResult = result.trim();

    const normalizedObservations = observations.trim();

    /*
     * La fecha corresponde al momento en que el técnico
     * confirma realmente la operación, no al momento en
     * que abrió el formulario.
     *
     * activarServicio se omite deliberadamente.
     */
    const input: CompleteInstallationRequest = {
      resultado: normalizedResult || null,

      observaciones: normalizedObservations || null,

      fechaFinalizacion: new Date().toISOString(),
    };

    try {
      await completeMutation.mutateAsync({
        installationId: installation.id,

        input,
      });

      setConfirmationOpen(false);

      setCompleted(true);
    } catch (error) {
      setFeedback(
        "No se pudo completar la instalación. Revisa la información e intenta nuevamente.",
      );

      /*
       * AppConfirmDialog mantiene abierta la
       * confirmación cuando la Promise falla.
       */
      throw error;
    }
  };

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <View style={styles.root}>
      {/* ===================================================
          TOP BAR
         =================================================== */}

      <AppTopBar
        title="Completar instalación"
        subtitle={`Instalación #${installation.id}`}
        back
        onBack={onBack}
        safeAreaEdges={[]}
        variant="background"
        divider
      />

      {/* ===================================================
          FORM
         =================================================== */}

      <AppKeyboardScreen
        safeAreaEdges={[]}
        contentPaddingVertical="md"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppStack gap="lg">
          {/* ===============================================
              CONTEXT
             =============================================== */}

          <AppCard variant="tonal" radius="lg" padding="md">
            <AppStack gap="md">
              <AppInline align="center" justify="space-between" gap="sm" wrap>
                <InstallationStatusBadge status={installation.estado} />

                <AppBadge size="sm" variant="soft" tone="neutral">
                  {`#${installation.id}`}
                </AppBadge>
              </AppInline>

              <AppStack gap="xs">
                <AppText variant="titleMedium" weight="semibold">
                  {installation.cliente.nombreCompleto}
                </AppText>

                {installation.servicioInternet ? (
                  <AppText variant="bodySmall" tone="secondary">
                    {installation.servicioInternet.nombre}
                  </AppText>
                ) : null}
              </AppStack>

              <AppText variant="bodySmall" tone="secondary">
                Revisa el resultado del trabajo antes de marcar definitivamente
                la instalación como completada.
              </AppText>
            </AppStack>
          </AppCard>

          {/* ===============================================
              RESULT
             =============================================== */}

          <AppCard variant="outlined" radius="lg" padding="md">
            <AppStack gap="md">
              <AppInline align="center" gap="sm">
                <AppIcon
                  icon={ClipboardCheck}
                  size="md"
                  tone="primary"
                  decorative
                />

                <AppStack gap="xs" flex>
                  <AppText variant="titleMedium" weight="semibold">
                    Resultado del trabajo
                  </AppText>

                  <AppText variant="bodySmall" tone="secondary">
                    Registra la información que debe quedar asociada al cierre
                    técnico.
                  </AppText>
                </AppStack>
              </AppInline>

              <AppTextArea
                label="Resultado"
                description="Opcional. Resume el resultado final de la instalación."
                placeholder="Ej. Instalación realizada y conexión verificada correctamente."
                value={result}
                onChangeText={setResult}
                minRows={4}
                maxLength={1000}
                showCharacterCount
                disabled={completeMutation.isPending}
                accessibilityLabel="Resultado de la instalación"
              />

              <AppTextArea
                label="Observaciones"
                description="Opcional. Agrega cualquier detalle adicional que deba quedar registrado."
                placeholder="Ej. Cliente informado sobre ubicación del equipo y acceso Wi-Fi."
                value={observations}
                onChangeText={setObservations}
                minRows={4}
                maxLength={1000}
                showCharacterCount
                disabled={completeMutation.isPending}
                accessibilityLabel="Observaciones de la instalación"
              />
            </AppStack>
          </AppCard>

          {/* ===============================================
              COMPLETION INFO
             =============================================== */}

          <AppCard variant="tonal" radius="lg" padding="md">
            <AppStack gap="sm">
              <AppText variant="bodySmall" weight="semibold">
                Al completar
              </AppText>

              <AppText variant="bodySmall" tone="secondary">
                La fecha de finalización se registrará con la hora del momento
                en que confirmes la operación.
              </AppText>

              {installation.agenda.inicioReal ? (
                <AppText variant="bodySmall" tone="secondary">
                  {`Inicio registrado: ${formatInstallationDate(
                    installation.agenda.inicioReal,
                  )}`}
                </AppText>
              ) : null}
            </AppStack>
          </AppCard>

          {/* ===============================================
              SUBMIT
             =============================================== */}

          <AppButton
            size="lg"
            variant="solid"
            tone="success"
            leadingIcon={CheckCircle2}
            fullWidth
            disabled={completeMutation.isPending}
            onPress={handleRequestComplete}
          >
            Completar instalación
          </AppButton>
        </AppStack>
      </AppKeyboardScreen>

      {/* ===================================================
          FINAL CONFIRMATION
         =================================================== */}

      <AppConfirmDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        title="Confirmar finalización"
        description="La instalación será marcada como completada con la información registrada."
        icon={CheckCircle2}
        tone="success"
        confirmTone="success"
        confirmLabel="Sí, completar"
        cancelLabel="Revisar"
        dismissable={!completeMutation.isPending}
        onConfirm={handleConfirmComplete}
      >
        <AppStack gap="sm">
          <AppText variant="bodySmall" tone="secondary">
            Verifica que el trabajo técnico haya terminado antes de continuar.
          </AppText>

          {result.trim() ? (
            <AppCard variant="tonal" radius="md" padding="sm">
              <AppStack gap="xs">
                <AppText variant="bodySmall" weight="semibold">
                  Resultado
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  {result.trim()}
                </AppText>
              </AppStack>
            </AppCard>
          ) : null}
        </AppStack>
      </AppConfirmDialog>

      {/* ===================================================
          ERROR FEEDBACK
         =================================================== */}

      <AppSnackbar
        open={feedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFeedback(null);
          }
        }}
        message={feedback ?? ""}
        tone="danger"
        position="bottom"
      />
    </View>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

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
}));
