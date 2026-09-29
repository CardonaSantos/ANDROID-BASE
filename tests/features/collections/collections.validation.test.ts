import { describe, expect, test } from "@jest/globals";

import type { CollectionInvoice } from "@/features/collections/api/collections.contracts.api";
import {
  buildCollectionPaymentInput,
  createCollectionPaymentForm,
} from "@/features/collections/application/collections.validation";

const invoice: CollectionInvoice = {
  id: 100,
  montoPago: 250,
  estadoFactura: "PENDIENTE",
  saldoPendiente: 125.5,
  creadoEn: "2026-09-28T10:00:00.000Z",
  detalleFactura: "Servicio de internet",
};

describe("collection payment validation", () => {
  test("inicializa el monto con el saldo pendiente", () => {
    const form = createCollectionPaymentForm(invoice);

    expect(form.montoPagado).toBe("125.5");
    expect(form.metodoPago).toBe("EFECTIVO");
  });

  test("requiere numero de boleta para deposito", () => {
    const result = buildCollectionPaymentInput({
      form: {
        ...createCollectionPaymentForm(invoice),
        metodoPago: "DEPOSITO",
        numeroBoleta: "",
      },
      invoiceId: invoice.id,
      clientId: 20,
      collectorId: 7,
      routeId: 3,
    });

    expect(result.success).toBe(false);
  });

  test("construye el payload final sin estado duplicado", () => {
    const result = buildCollectionPaymentInput({
      form: {
        ...createCollectionPaymentForm(invoice),
        montoPagado: "100,50",
        metodoPago: "DEPOSITO",
        numeroBoleta: " BOLETA-1 ",
      },
      invoiceId: invoice.id,
      clientId: 20,
      collectorId: 7,
      routeId: 3,
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        facturaInternetId: 100,
        clienteId: 20,
        montoPagado: 100.5,
        metodoPago: "DEPOSITO",
        cobradorId: 7,
        numeroBoleta: "BOLETA-1",
        rutaId: 3,
        observaciones: undefined,
      });
    }
  });
});
