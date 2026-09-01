import { ImagePlus, RefreshCw } from "lucide-react-native";

import { View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppCard,
  AppErrorState,
  AppKeyboardScreen,
  AppStack,
  AppStateView,
  AppText,
  AppTopBar,
} from "@/design-system";

import { InstallationStatusBadge } from "../components/list/InstallationStatusBadge";

import {
  InstallationEvidenceWorkspace,
  type InstallationEvidenceBatchResult,
  type InstallationEvidenceWorkspaceDraft,
} from "../evidence/InstallationEvidenceWorkspace";

import { useUploadInstallationEvidenceMutation } from "../hooks/installation-evidence.hooks";

import { useInstallationTechnicalDetailQuery } from "../hooks/installations.hooks";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationEvidenceUploadScreenProps {
  installationId: number;

  onBack: () => void;
}

/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export function InstallationEvidenceUploadScreen({
  installationId,
  onBack,
}: InstallationEvidenceUploadScreenProps) {
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

  const uploadMutation = useUploadInstallationEvidenceMutation();

  /*
   * =======================================================
   * INVALID ID
   * =======================================================
   */

  if (!hasValidInstallationId) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Agregar evidencias"
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
            description="El identificador recibido no corresponde a una instalación válida."
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
          title="Agregar evidencias"
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
            icon={ImagePlus}
            tone="primary"
            title="Preparando evidencias"
            description="Consultando los permisos técnicos de la instalación."
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
          title="Agregar evidencias"
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
          title="Agregar evidencias"
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
            description="No fue posible obtener la información técnica solicitada."
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
   * SERVER AUTHORITY
   * =======================================================
   *
   * Esta ruta puede abrirse mediante deep link.
   *
   * Por eso no confiamos únicamente en que el usuario
   * haya llegado desde el botón del detalle.
   * =======================================================
   */

  if (!installation.acciones.subirEvidencia.habilitada) {
    return (
      <View style={styles.root}>
        <AppTopBar
          title="Agregar evidencias"
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
            title="Carga de evidencias no disponible"
            description={
              installation.acciones.subirEvidencia.motivo ||
              "El servidor no permite agregar evidencias a esta instalación."
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
   * SINGLE UPLOAD
   * =======================================================
   *
   * InstallationEvidenceWorkspace construye el batch.
   *
   * Esta pantalla continúa ejecutando UNA evidencia
   * por llamada HTTP.
   * =======================================================
   */

  const handleSubmitEvidence = async (
    draft: InstallationEvidenceWorkspaceDraft,
  ) => {
    /*
     * Volvemos a comprobar autorización antes de
     * cada request.
     */

    if (!installation.acciones.subirEvidencia.habilitada) {
      throw new Error("Evidence upload is no longer enabled.");
    }

    await uploadMutation.mutateAsync({
      installationId: installation.id,

      empresaId: installation.empresaId,

      file: draft.file,

      tipo: draft.tipo,

      descripcion: draft.descripcion,

      orden: draft.orden,
    });
  };

  /*
   * =======================================================
   * BATCH COMPLETE
   * =======================================================
   *
   * No navegamos automáticamente.
   *
   * Esto permite:
   *
   * - agregar otra tanda;
   * - revisar errores;
   * - volver manualmente cuando el técnico termine.
   * =======================================================
   */

  const handleBatchComplete = (_result: InstallationEvidenceBatchResult) => {
    /*
     * El hook de upload ya invalida:
     *
     * - detalle técnico;
     * - instalaciones asignadas.
     *
     * No necesitamos modificar la caché manualmente aquí.
     */
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
        title="Agregar evidencias"
        subtitle={`Instalación #${installation.id}`}
        back
        onBack={onBack}
        safeAreaEdges={[]}
        variant="background"
        divider
      />

      {/* ===================================================
          FORM SCREEN
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
            <AppStack gap="sm">
              <InstallationStatusBadge status={installation.estado} />

              <AppText variant="titleMedium" weight="semibold">
                {installation.cliente.nombreCompleto}
              </AppText>

              <AppText variant="bodySmall" tone="secondary">
                Selecciona las fotografías necesarias, recórtalas y clasifica
                cada evidencia antes de enviarla.
              </AppText>
            </AppStack>
          </AppCard>

          {/* ===============================================
              WORKSPACE
             =============================================== */}

          <InstallationEvidenceWorkspace
            loading={uploadMutation.isPending}
            onSubmit={handleSubmitEvidence}
            onBatchComplete={handleBatchComplete}
          />
        </AppStack>
      </AppKeyboardScreen>
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
