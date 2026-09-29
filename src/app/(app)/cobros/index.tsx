import { useRouter } from "expo-router";

import { AssignedRoutesScreen } from "@/features/collections";

export default function CollectionsScreen() {
  const router = useRouter();

  return (
    <AssignedRoutesScreen
      onOpenRoute={(routeId) => {
        router.push({
          pathname: "/cobros/[rutaId]",
          params: {
            rutaId: String(routeId),
          },
        });
      }}
    />
  );
}
