import type { CollectionInvoiceReceipt } from "../api/collections.contracts.api";
import { buildCollectionReceiptHtml } from "./collection-receipt.document";

/*
 * =========================================================
 * WEB PRINT ADAPTER
 * =========================================================
 *
 * expo-print no utiliza el HTML recibido como documento
 * aislado en Web; termina delegando la impresión de la
 * página actual del navegador.
 *
 * Para evitar imprimir el shell completo de la aplicación,
 * Web utiliza un iframe temporal que contiene SOLAMENTE el
 * comprobante térmico.
 *
 * Android/iOS continúan resolviendo el archivo base:
 * collection-receipt.print.ts
 * y siguen usando expo-print.
 * =========================================================
 */

const PRINT_FRAME_ID = "collection-receipt-print-frame";

function removeExistingPrintFrame(): void {
  const existing = document.getElementById(PRINT_FRAME_ID);

  if (existing) {
    existing.remove();
  }
}

function waitForFrameReady(
  frame: HTMLIFrameElement,
  frameDocument: Document,
): Promise<void> {
  return new Promise((resolve) => {
    const finish = () => {
      /*
       * Dos frames permiten que Chromium calcule primero
       * layout, @page y tipografía antes de abrir preview.
       */
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          resolve();
        });
      });
    };

    if (frameDocument.readyState === "complete") {
      finish();
      return;
    }

    frame.addEventListener("load", finish, {
      once: true,
    });

    /*
     * document.write() sobre about:blank puede no disparar
     * load igual en todos los navegadores. Este fallback
     * evita bloquear la acción de impresión.
     */
    window.setTimeout(finish, 150);
  });
}

export async function printCollectionInvoiceReceipt(
  receipt: CollectionInvoiceReceipt,
): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("WEB_PRINT_ENVIRONMENT_UNAVAILABLE");
  }

  const html = buildCollectionReceiptHtml(receipt);

  removeExistingPrintFrame();

  const frame = document.createElement("iframe");

  frame.id = PRINT_FRAME_ID;
  frame.title = `Comprobante factura ${receipt.id}`;

  /*
   * No usar display:none:
   * Chromium necesita layout real para construir la vista
   * de impresión. Lo dejamos fuera del viewport.
   */
  Object.assign(frame.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: "80mm",
    height: "200mm",
    border: "0",
    opacity: "0",
    pointerEvents: "none",
    background: "#ffffff",
  });

  document.body.appendChild(frame);

  const frameWindow = frame.contentWindow;
  const frameDocument = frame.contentDocument;

  if (!frameWindow || !frameDocument) {
    frame.remove();
    throw new Error("WEB_PRINT_FRAME_UNAVAILABLE");
  }

  frameDocument.open();
  frameDocument.write(html);
  frameDocument.close();

  await waitForFrameReady(frame, frameDocument);

  let cleaned = false;

  const cleanup = () => {
    if (cleaned) {
      return;
    }

    cleaned = true;
    frame.remove();
  };

  frameWindow.addEventListener("afterprint", cleanup, {
    once: true,
  });

  /*
   * Fallback: algunos navegadores no disparan afterprint
   * cuando el usuario cancela la vista previa.
   */
  window.setTimeout(cleanup, 60_000);

  frameWindow.focus();
  frameWindow.print();
}
