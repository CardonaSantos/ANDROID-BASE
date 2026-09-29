import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";

import { CollectionRouteScreen } from "@/features/collections";

export default function CollectionRoutePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ rutaId?: string | string[] }>();

  const rawRouteId = Array.isArray(params.rutaId)
    ? params.rutaId[0]
    : params.rutaId;
  const routeId = Number(rawRouteId);

  return (
    <CollectionRouteScreen
      routeId={routeId}
      onBack={() => {
        router.back();
      }}
      onCopyText={async (value) => {
        await Clipboard.setStringAsync(value);
      }}
      onOpenClientProfile={(clientId) => {
        router.push({
          pathname: "/clientes/[clienteId]",
          params: {
            clienteId: String(clientId),
          },
        });
      }}
      onOpenReceipt={(invoiceId) => {
        router.push({
          pathname: "/cobros/comprobante/[facturaId]",
          params: {
            facturaId: String(invoiceId),
          },
        });
      }}
    />
  );
}
