import { useLocalSearchParams, useRouter } from "expo-router";

import { InstallationCompleteScreen } from "@/features/installations/presentation/InstallationCompleteScreen";

export default function InstallationCompleteRoute() {
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
     * Flujo habitual:
     *
     * /instalaciones/:id
     *        ↓
     * /instalaciones/:id/completar
     */

    if (router.canGoBack()) {
      router.back();

      return;
    }

    /*
     * Entrada mediante deep link:
     *
     * intentamos regresar directamente al detalle.
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
     * Fallback final.
     */

    router.replace("/instalaciones");
  };

  return (
    <InstallationCompleteScreen
      installationId={installationId}
      onBack={handleBack}
    />
  );
}
