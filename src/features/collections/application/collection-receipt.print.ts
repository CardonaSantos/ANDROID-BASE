import * as Print from "expo-print";

import type { CollectionInvoiceReceipt } from "../api/collections.contracts.api";
import { buildCollectionReceiptHtml } from "./collection-receipt.document";

/*
 * =========================================================
 * PRINT ADAPTER
 * =========================================================
 *
 * No se fija impresora, IP, Bluetooth ni proveedor.
 * Android abre su selector nativo de impresión y el usuario puede usar
 * cualquier servicio compatible instalado en el dispositivo.
 *
 * Esto mantiene la feature desacoplada de RawBT o de un modelo específico.
 */

export async function printCollectionInvoiceReceipt(
  receipt: CollectionInvoiceReceipt,
): Promise<void> {
  const html = buildCollectionReceiptHtml(receipt);

  await Print.printAsync({
    html,
    orientation: Print.Orientation.portrait,
  });
}
