import { useLocalSearchParams, useRouter } from "expo-router";

import { InstallationEvidenceUploadScreen } from "@/features/installations/presentation/InstallationEvidenceUploadScreen";

export default function InstallationEvidenceUploadRoute() {
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

  /*
   * =======================================================
   * BACK
   * =======================================================
   */

  const handleBack = () => {
    /*
     * Entrada normal:
     *
     * /instalaciones/:id
     *          ↓
     * /instalaciones/:id/evidencias
     */

    if (router.canGoBack()) {
      router.back();

      return;
    }

    /*
     * Deep link válido:
     * regresamos directamente al detalle.
     */

    if (Number.isInteger(installationId) && installationId > 0) {
      router.replace({
        pathname: "/instalaciones/[instalacionId]",

        params: {
          instalacionId: String(installationId),
        },
      });

      return;
    }

    /*
     * Param inválido:
     * fallback final a la bandeja.
     */

    router.replace("/instalaciones");
  };

  return (
    <InstallationEvidenceUploadScreen
      installationId={installationId}
      onBack={handleBack}
    />
  );
}
