import { describe, expect, test } from "@jest/globals";

import type { CollectionRouteDetail } from "@/features/collections/api/collections.contracts.api";
import {
  getCollectionRouteDebtTotal,
  getCollectionRoutePendingInvoiceCount,
  getMappableCollectionClients,
} from "@/features/collections/application/collections.selectors";

const route: CollectionRouteDetail = {
  id: 1,
  nombreRuta: "Ruta prueba",
  creadoEn: "2026-09-28T10:00:00.000Z",
  actualizadoEn: "2026-09-28T10:00:00.000Z",
  cobrador: null,
  clientes: [
    {
      id: 1,
      nombreCompleto: "Cliente A",
      telefono: null,
      direccion: null,
      imagenes: [],
      contactoReferencia: { telefono: null, nombre: null },
      ubicacion: { latitud: 15.6, longitud: -91.7 },
      facturas: [
        {
          id: 10,
          montoPago: 100,
          estadoFactura: "PENDIENTE",
          saldoPendiente: 100,
          creadoEn: "2026-09-28T10:00:00.000Z",
          detalleFactura: null,
        },
      ],
      saldo: { saldoFavor: 0, saldoPendiente: 100, ultimoPago: null },
      totalDebe: 100,
    },
    {
      id: 2,
      nombreCompleto: "Cliente B",
      telefono: null,
      direccion: null,
      imagenes: [],
      contactoReferencia: { telefono: null, nombre: null },
      ubicacion: null,
      facturas: [],
      saldo: { saldoFavor: 0, saldoPendiente: 50, ultimoPago: null },
      totalDebe: 50,
    },
  ],
};

describe("collections selectors", () => {
  test("cuenta las facturas devueltas por el endpoint operativo", () => {
    expect(getCollectionRoutePendingInvoiceCount(route)).toBe(1);
  });

  test("suma la deuda de clientes", () => {
    expect(getCollectionRouteDebtTotal(route)).toBe(150);
  });

  test("solo entrega clientes con coordenadas al mapa", () => {
    expect(getMappableCollectionClients(route.clientes).map((c) => c.id)).toEqual([
      1,
    ]);
  });
});
