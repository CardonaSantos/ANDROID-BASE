import { CollectionReceiptScreen } from "@/features/collections/presentation/CollectionReceiptScreen";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CollectionReceiptPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ facturaId?: string | string[] }>();

  const rawInvoiceId = Array.isArray(params.facturaId)
    ? params.facturaId[0]
    : params.facturaId;
  const invoiceId = Number(rawInvoiceId);

  return (
    <CollectionReceiptScreen
      invoiceId={invoiceId}
      onBack={() => {
        router.back();
      }}
    />
  );
}
