import { RefreshCw, Wrench } from "lucide-react-native";

import { useState } from "react";

import { View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppErrorState,
  AppIconButton,
  AppScrollScreen,
  AppSnackbar,
  AppStack,
  AppStateView,
  AppTopBar,
} from "@/design-system";

import { StartInstallationDialog } from "../components/actions/StartInstallationDialog";

import { InstallationAccessSection } from "../components/detail/InstallationAccessSection";

import {
  InstallationBottomActionBar,
  type InstallationLifecycleAction,
} from "../components/detail/InstallationBottomActionBar";

import { InstallationClientSection } from "../components/detail/InstallationClientSection";

import { InstallationEquipmentSection } from "../components/detail/InstallationEquipmentSection";

import { InstallationEvidenceSection } from "../components/detail/InstallationEvidenceSection";

import { InstallationHero } from "../components/detail/InstallationHero";

import { InstallationLocationSection } from "../components/detail/InstallationLocationSection";

import {
  InstallationCostsSection,
  InstallationParticipantsSection,
} from "../components/detail/InstallationParticipantsSection";

import { InstallationServiceSection } from "../components/detail/InstallationServiceSection";

import { InstallationWorkSection } from "../components/detail/InstallationWorkSection";

import { useInstallationTechnicalDetailQuery } from "../hooks/installations.hooks";

import { useStartInstallationMutation } from "../hooks/installations.mutations.hooks";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationDetailScreenProps {
  installationId: number;

  onBack: () => void;

  onCopyText: (value: string) => void | Promise<void>;

  /*
   * Ruta independiente para carga de evidencias.
   */
  onAddEvidence: () => void;

  /*
   * Ruta independiente para completar.
   *
   * El detalle no conoce Expo Router.
   */
  onCompleteInstallation: () => void;
}

/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export function InstallationDetailScreen({
  installationId,
  onBack,
  onCopyText,
  onAddEvidence,
  onCompleteInstallation,
}: InstallationDetailScreenProps) {
  /*
   * =======================================================
   * UI STATE
   * =======================================================
   *
   * Solo INICIAR sigue siendo una acción modal.
   *
   * Completar tiene ahora su propia pantalla.
   * =======================================================
   */

  const [pendingAction, setPendingAction] =
    useState<InstallationLifecycleAction | null>(null);

  const [feedback, setFeedback] = useState<{
    message: string;

    tone: "success" | "danger";
  } | null>(null);

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
   * MUTATIONS
   * =======================================================
   *
   * Completar ya no se ejecuta desde este screen.
   * =======================================================
   */

  const startMutation = useStartInstallationMutation();

  const loadingAction: InstallationLifecycleAction | null =
    startMutation.isPending ? "start" : null;

  /*
   * =======================================================
   * INVALID ID
   * =======================================================
   */

  if (!hasValidInstallationId) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Detalle de instalación"
          subtitle="Gestión técnica"
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
              label: "Volver a instalaciones",

              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * INITIAL LOADING
   * =======================================================
   */

  if (installationQuery.isPending) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Instalación #${installationId}`}
          subtitle="Gestión técnica"
          back
          onBack={onBack}
          safeAreaEdges={[]}
          variant="background"
          divider
        />

        <View style={styles.stateContainer}>
          <AppStateView
            fill
            icon={Wrench}
            tone="primary"
            title="Cargando instalación"
            description="Consultando la información técnica de la instalación."
            announceOnMount
          />
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * ERROR
   * =======================================================
   */

  if (installationQuery.isError) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title={`Instalación #${installationId}`}
          subtitle="Gestión técnica"
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
            description="Revisa tu conexión o intenta consultar nuevamente."
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
          title={`Instalación #${installationId}`}
          subtitle="Gestión técnica"
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
            description="No fue posible obtener la información de la instalación solicitada."
            primaryAction={{
              label: "Volver a instalaciones",

              onPress: onBack,
            }}
          />
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * START
   * =======================================================
   */

  const handleStart = async () => {
    if (!installation.acciones.iniciar.habilitada) {
      setFeedback({
        message:
          installation.acciones.iniciar.motivo ||
          "El servidor no permite iniciar esta instalación.",

        tone: "danger",
      });

      return;
    }

    try {
      await startMutation.mutateAsync({
        installationId: installation.id,

        input: {},
      });

      setPendingAction(null);

      setFeedback({
        message: "La instalación fue iniciada correctamente.",

        tone: "success",
      });
    } catch (error) {
      setFeedback({
        message: "No se pudo iniciar la instalación.",

        tone: "danger",
      });

      throw error;
    }
  };

  /*
   * =======================================================
   * EVIDENCE NAVIGATION
   * =======================================================
   */

  const handleAddEvidence = () => {
    if (!installation.acciones.subirEvidencia.habilitada) {
      setFeedback({
        message:
          installation.acciones.subirEvidencia.motivo ||
          "El servidor no permite agregar evidencias a esta instalación.",

        tone: "danger",
      });

      return;
    }

    onAddEvidence();
  };

  /*
   * =======================================================
   * COMPLETE NAVIGATION
   * =======================================================
   *
   * Completar ya NO ejecuta una mutation desde aquí.
   *
   * Solamente validamos la acción recibida del servidor
   * y navegamos al formulario dedicado.
   * =======================================================
   */

  const handleCompleteInstallation = () => {
    if (!installation.acciones.completar.habilitada) {
      setFeedback({
        message:
          installation.acciones.completar.motivo ||
          "El servidor no permite completar esta instalación.",

        tone: "danger",
      });

      return;
    }

    onCompleteInstallation();
  };

  /*
   * =======================================================
   * BOTTOM ACTION REQUEST
   * =======================================================
   */

  const handleRequestAction = (action: InstallationLifecycleAction) => {
    switch (action) {
      /*
       * Inicio:
       * confirmación breve mediante diálogo.
       */
      case "start":
        setPendingAction("start");

        return;

      /*
       * Completar:
       * formulario en pantalla independiente.
       */
      case "complete":
        handleCompleteInstallation();

        return;
    }
  };

  /*
   * =======================================================
   * CONTENT
   * =======================================================
   */

  return (
    <View style={styles.root}>
      {/* ===================================================
          TOOLBAR
         =================================================== */}

      <AppTopBar
        title={`Instalación #${installation.id}`}
        subtitle=""
        back
        onBack={onBack}
        safeAreaEdges={[]}
        variant="background"
        divider
        actions={
          <AppIconButton
            icon={RefreshCw}
            size="sm"
            variant="ghost"
            tone="neutral"
            accessibilityLabel="Actualizar detalle de la instalación"
            loadingAccessibilityLabel="Actualizando detalle de la instalación"
            loading={installationQuery.isFetching}
            disabled={startMutation.isPending}
            onPress={() => {
              void installationQuery.refetch();
            }}
          />
        }
      />

      {/* ===================================================
          CONTENT
         =================================================== */}

      <AppScrollScreen
        safeAreaEdges={[]}
        contentPaddingVertical="md"
        scrollStyle={styles.scroll}
        scrollContentStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppStack gap="md">
          <InstallationHero installation={installation} />

          <InstallationClientSection
            installation={installation}
            onCopyText={onCopyText}
          />

          <InstallationLocationSection
            installation={installation}
            onCopyText={onCopyText}
          />

          <InstallationWorkSection installation={installation} />

          <InstallationServiceSection installation={installation} />

          <InstallationAccessSection installation={installation} />

          <InstallationEquipmentSection installation={installation} />

          <InstallationEvidenceSection
            installation={installation}
            onAddEvidence={handleAddEvidence}
          />

          <InstallationParticipantsSection installation={installation} />

          <InstallationCostsSection installation={installation} />
        </AppStack>
      </AppScrollScreen>

      {/* ===================================================
          LIFECYCLE BAR
         =================================================== */}

      <InstallationBottomActionBar
        actions={installation.acciones}
        isLoadingAction={loadingAction}
        onRequestAction={handleRequestAction}
      />

      {/* ===================================================
          START CONFIRMATION
         =================================================== */}

      <StartInstallationDialog
        open={pendingAction === "start"}
        installation={installation}
        loading={startMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setPendingAction(null);
          }
        }}
        onConfirm={handleStart}
      />

      {/* ===================================================
          FEEDBACK
         =================================================== */}

      <AppSnackbar
        open={feedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFeedback(null);
          }
        }}
        message={feedback?.message ?? ""}
        tone={feedback?.tone ?? "success"}
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

  scroll: {
    flex: 1,

    minHeight: 0,
  },

  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
}));
