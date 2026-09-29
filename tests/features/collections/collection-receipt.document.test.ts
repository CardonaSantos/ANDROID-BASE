import { describe, expect, test } from "@jest/globals";

import type { CollectionInvoiceReceipt } from "@/features/collections/api/collections.contracts.api";
import {
  buildCollectionReceiptHtml,
  getCollectionReceiptTotalPaid,
} from "@/features/collections/application/collection-receipt.document";

function createReceipt(): CollectionInvoiceReceipt {
  return {
    id: 58,
    estadoFacturaInternet: "PARCIAL",
    montoPago: 500,
    detalleFactura: "Internet <Plan Hogar>",
    creadoEn: "2026-09-28T12:00:00.000Z",
    fechaPagoEsperada: "2026-09-30T06:00:00.000Z",
    saldoPendiente: 100,
    periodo: "202609",
    cliente: {
      id: 10,
      nombre: "Marcos",
      apellidos: "Jimenez",
      dpi: null,
    },
    empresa: {
      id: 1,
      nombre: "NOVA & INTERNET",
      direccion: "Jacaltenango",
      correo: null,
      pbx: null,
      sitioWeb: null,
      telefono: "12345678",
      nit: null,
    },
    pagos: [
      {
        id: 1,
        metodoPago: "EFECTIVO",
        montoPagado: 150,
        fechaPago: "2026-09-20T16:00:00.000Z",
        creadoEn: "2026-09-20T16:00:00.000Z",
        numeroBoleta: null,
      },
      {
        id: 2,
        metodoPago: "DEPOSITO",
        montoPagado: 250,
        fechaPago: "2026-09-28T16:00:00.000Z",
        creadoEn: "2026-09-28T16:00:00.000Z",
        numeroBoleta: "ABC-1",
      },
    ],
    servicios: [],
  };
}

describe("collection receipt document", () => {
  test("suma todo el historial de pagos de la factura", () => {
    expect(getCollectionReceiptTotalPaid(createReceipt())).toBe(400);
  });

  test("genera el ticket térmico con todos los pagos", () => {
    const html = buildCollectionReceiptHtml(
      createReceipt(),
      new Date("2026-09-28T18:00:00.000Z"),
    );

    expect(html).toContain("Factura 58");
    expect(html).toContain("EFECTIVO");
    expect(html).toContain("DEPOSITO");
    expect(html).toContain("Q400.00");
    expect(html).toContain("202609");
  });

  test("escapa contenido externo antes de insertarlo en HTML", () => {
    const html = buildCollectionReceiptHtml(createReceipt());

    expect(html).toContain("NOVA &amp; INTERNET");
    expect(html).toContain("Internet &lt;Plan Hogar&gt;");
  });
});
