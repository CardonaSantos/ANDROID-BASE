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
   * ROUTE PARAM
   * =======================================================
   *
   * Expo Router entrega parámetros como strings.
   *
   * Si es inválido enviamos 0 y la pantalla presenta
   * explícitamente su estado de identificador inválido.
   * =======================================================
   */

  const installationId = Number(installationIdParam ?? 0);

  /*
   * =======================================================
   * BACK
   * =======================================================
   *
   * Navegación habitual:
   *
   * /instalaciones
   *       ↓
   * /instalaciones/:id
   *
   * En deep link utilizamos /instalaciones como fallback.
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

  return (
    <InstallationDetailScreen
      installationId={installationId}
      onBack={handleBack}
      onCopyText={handleCopyText}
    />
  );
}
