import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";

import { CustomerProfileScreen } from "@/features/customers";

export default function CustomerProfileRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ clienteId?: string | string[] }>();

  const rawCustomerId = Array.isArray(params.clienteId)
    ? params.clienteId[0]
    : params.clienteId;

  const customerId = Number(rawCustomerId);

  return (
    <CustomerProfileScreen
      customerId={customerId}
      onBack={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }

        router.replace("/");
      }}
      onCopyText={async (value) => {
        await Clipboard.setStringAsync(value);
      }}
    />
  );
}
