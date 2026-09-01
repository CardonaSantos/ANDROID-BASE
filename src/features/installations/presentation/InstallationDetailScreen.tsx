import { RefreshCw, Wrench } from "lucide-react-native";

import { View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppErrorState,
  AppIconButton,
  AppScrollScreen,
  AppStack,
  AppStateView,
  AppTopBar,
} from "@/design-system";

import { InstallationAccessSection } from "../components/detail/InstallationAccessSection";

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

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationDetailScreenProps {
  installationId: number;

  onBack: () => void;

  onCopyText: (value: string) => void | Promise<void>;
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
}: InstallationDetailScreenProps) {
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
   *
   * El query ya contiene su propio `enabled`.
   *
   * Por lo tanto un id inválido no produce un request.
   * =======================================================
   */

  const installationQuery = useInstallationTechnicalDetailQuery(installationId);

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

  /*
   * =======================================================
   * NOT AVAILABLE
   * =======================================================
   */

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
   * CONTENT
   * =======================================================
   */

  return (
    <View style={styles.root}>
      {/* ===================================================
          LOCAL TOOLBAR
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
            onPress={() => {
              void installationQuery.refetch();
            }}
          />
        }
      />

      {/* ===================================================
          SCROLLABLE CONTENT
         =================================================== */}

      <AppScrollScreen
        safeAreaEdges={[]}
        contentPaddingVertical="md"
        scrollStyle={styles.scroll}
        scrollContentStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppStack gap="md">
          {/* ===============================================
              RESUMEN
             =============================================== */}

          <InstallationHero installation={installation} />

          {/* ===============================================
              CLIENTE / UBICACIÓN
             =============================================== */}

          <InstallationClientSection
            installation={installation}
            onCopyText={onCopyText}
          />

          <InstallationLocationSection
            installation={installation}
            onCopyText={onCopyText}
          />

          {/* ===============================================
              TRABAJO / SERVICIO
             =============================================== */}

          <InstallationWorkSection installation={installation} />

          <InstallationServiceSection installation={installation} />

          {/* ===============================================
              RED / ACCESOS
             =============================================== */}

          <InstallationAccessSection installation={installation} />

          {/* ===============================================
              RECURSOS
             =============================================== */}

          <InstallationEquipmentSection installation={installation} />

          <InstallationEvidenceSection installation={installation} />

          {/* ===============================================
              PERSONAL / COBRO
             =============================================== */}

          <InstallationParticipantsSection installation={installation} />

          <InstallationCostsSection installation={installation} />
        </AppStack>
      </AppScrollScreen>
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
