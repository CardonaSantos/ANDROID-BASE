import { useRouter } from "expo-router";

import { InstallationsAssignedScreen } from "@/features/installations/presentation/InstallationsAssignedScreen";

export default function InstallationsRoute() {
  const router = useRouter();

  const handleOpenDetails = (installationId: number) => {
    router.push({
      pathname: "/instalaciones/[instalacionId]",

      params: {
        instalacionId: String(installationId),
      },
    });
  };

  return <InstallationsAssignedScreen onOpenDetails={handleOpenDetails} />;
}
