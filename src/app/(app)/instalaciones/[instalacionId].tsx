import * as Clipboard from "expo-clipboard";

import { useLocalSearchParams, useRouter } from "expo-router";

import { InstallationDetailScreen } from "@/features/installations/presentation/InstallationDetailScreen";

export default function InstallationDetailRoute() {
  const router = useRouter();

  const { instalacionId: installationIdParam } = useLocalSearchParams<{
    instalacionId?: string;
  }>();

  /*
   * =======================================================
   * PARAM
   * =======================================================
   */

  const installationId = Number(installationIdParam ?? 0);

  const hasValidInstallationId =
    Number.isInteger(installationId) && installationId > 0;

  /*
   * =======================================================
   * BACK
   * =======================================================
   */

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();

      return;
    }

    router.replace("/instalaciones");
  };

  /*
   * =======================================================
   * CLIPBOARD
   * =======================================================
   */

  const handleCopyText = async (value: string) => {
    await Clipboard.setStringAsync(value);
  };

  /*
   * =======================================================
   * EVIDENCES
   * =======================================================
   */

  const handleAddEvidence = () => {
    if (!hasValidInstallationId) {
      return;
    }

    router.push({
      pathname: "/instalaciones/[instalacionId]/evidencias",

      params: {
        instalacionId: String(installationId),
      },
    });
  };

  /*
   * =======================================================
   * COMPLETE INSTALLATION
   * =======================================================
   */

  const handleCompleteInstallation = () => {
    if (!hasValidInstallationId) {
      return;
    }

    router.push({
      pathname: "/instalaciones/[instalacionId]/completar",

      params: {
        instalacionId: String(installationId),
      },
    });
  };

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <InstallationDetailScreen
      installationId={installationId}
      onBack={handleBack}
      onCopyText={handleCopyText}
      onAddEvidence={handleAddEvidence}
      onCompleteInstallation={handleCompleteInstallation}
    />
  );
}
