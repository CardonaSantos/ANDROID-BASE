import type { CollectionInvoiceReceipt } from "../api/collections.contracts.api";
import {
  formatCollectionDateTime,
  formatCollectionMoney,
} from "../collections.helpers";

const THERMAL_PAPER_WIDTH_MM = 80;
const THERMAL_CONTENT_WIDTH_MM = 72;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function text(value: string | null | undefined, fallback = ""): string {
  const normalized = value?.trim();

  return escapeHtml(normalized || fallback);
}

export function getCollectionReceiptClientName(
  receipt: CollectionInvoiceReceipt,
): string {
  return [receipt.cliente.nombre, receipt.cliente.apellidos]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .trim();
}

export function getCollectionReceiptTotalPaid(
  receipt: CollectionInvoiceReceipt,
): number {
  return receipt.pagos.reduce((total, payment) => {
    return total + payment.montoPagado;
  }, 0);
}

export function buildCollectionReceiptHtml(
  receipt: CollectionInvoiceReceipt,
  generatedAt: Date = new Date(),
): string {
  const clientName = getCollectionReceiptClientName(receipt) || "CLIENTE";
  const totalPaid = getCollectionReceiptTotalPaid(receipt);

  const paymentRows = receipt.pagos.length
    ? receipt.pagos
        .map(
          (payment) => `
            <tr>
              <td>${text(payment.metodoPago)}</td>
              <td class="money">${escapeHtml(
                formatCollectionMoney(payment.montoPagado),
              )}</td>
            </tr>`,
        )
        .join("")
    : `
        <tr>
          <td colspan="2" class="empty">SIN PAGOS REGISTRADOS</td>
        </tr>`;

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
    />
    <title>Comprobante factura ${receipt.id}</title>
    <style>
      @page {
        size: ${THERMAL_PAPER_WIDTH_MM}mm auto;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        width: ${THERMAL_PAPER_WIDTH_MM}mm;
        background: #ffffff;
        color: #000000;
      }

      body {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          "Liberation Mono", "Courier New", monospace;
        font-size: 12px;
        line-height: 1.28;
        font-weight: 700;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .ticket {
        width: ${THERMAL_CONTENT_WIDTH_MM}mm;
        margin: 0 auto;
        padding: 3mm 0 5mm;
      }

      .center {
        text-align: center;
      }

      .uppercase {
        text-transform: uppercase;
      }

      .section {
        padding: 0 0 2.2mm;
        margin: 0 0 2.2mm;
        border-bottom: 1px dashed #000000;
        break-inside: avoid;
      }

      .company-name {
        margin: 0 0 1mm;
        font-size: 14px;
        font-weight: 900;
      }

      .line {
        margin: 0.6mm 0;
        overflow-wrap: anywhere;
      }

      .label {
        font-weight: 900;
      }

      .concept {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }

      td {
        padding: 1mm 0;
        vertical-align: top;
        overflow-wrap: anywhere;
      }

      td:first-child {
        width: 58%;
      }

      .money {
        width: 42%;
        text-align: right;
        font-weight: 900;
      }

      .payments-title {
        text-align: center;
        padding-bottom: 1mm;
        border-bottom: 1px dashed #000000;
      }

      .total {
        margin-top: 1mm;
        padding-top: 2mm;
        border-top: 2px dashed #000000;
        text-align: right;
        font-size: 14px;
        font-weight: 900;
      }

      .empty {
        text-align: center;
        padding: 2mm 0;
      }

      .footer {
        margin-top: 4mm;
        text-align: center;
        font-size: 10px;
      }
    </style>
  </head>
  <body>
    <main class="ticket">
      <section class="section center">
        <h1 class="company-name uppercase">${text(receipt.empresa.nombre)}</h1>
        ${
          receipt.empresa.telefono
            ? `<p class="line">${text(receipt.empresa.telefono)}</p>`
            : ""
        }
        ${
          receipt.empresa.direccion
            ? `<p class="line">${text(receipt.empresa.direccion)}</p>`
            : ""
        }
      </section>

      <section class="section">
        <p class="line"><span class="label">Recibo No:</span> #${receipt.id}</p>
        <p class="line"><span class="label">Periodo:</span> ${text(
          receipt.periodo,
          "N/A",
        )}</p>
        <p class="line"><span class="label">Fecha:</span> ${escapeHtml(
          formatCollectionDateTime(generatedAt),
        )}</p>
      </section>

      <section class="section">
        <p class="line label">CLIENTE:</p>
        <p class="line uppercase">${text(clientName, "CLIENTE")}</p>
      </section>

      <section class="section">
        <p class="line label">CONCEPTO:</p>
        <p class="line concept">${text(
          receipt.detalleFactura,
          "Pago de servicio de internet",
        )}</p>
      </section>

      <section>
        <div class="payments-title">- DETALLE PAGOS -</div>
        <table aria-label="Detalle de pagos">
          <tbody>
            ${paymentRows}
          </tbody>
        </table>

        <div class="total">TOTAL: ${escapeHtml(
          formatCollectionMoney(totalPaid),
        )}</div>
      </section>

      <footer class="footer">
        <p>*** GRACIAS POR SU PAGO ***</p>
      </footer>
    </main>
  </body>
</html>`;
}
