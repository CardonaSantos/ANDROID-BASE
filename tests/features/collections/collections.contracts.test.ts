import { describe, expect, test } from "@jest/globals";

import {
  assignedRoutesResponseSchema,
  collectionRouteDetailSchema,
} from "@/features/collections/api/collections.contracts.api";

describe("collections contracts", () => {
  test("normaliza ubicacion vacia del backend a null", () => {
    const result = collectionRouteDetailSchema.parse({
      id: 10,
      nombreRuta: "Ruta Centro",
      creadoEn: "2026-09-28T10:00:00.000Z",
      actualizadoEn: "2026-09-28T10:00:00.000Z",
      cobrador: {
        id: 7,
        nombre: "Cobrador",
        correo: "cobrador@example.com",
      },
      clientes: [
        {
          id: 99,
          nombreCompleto: "Cliente Uno",
          telefono: "55555555",
          direccion: "Centro",
          imagenes: [],
          contactoReferencia: {
            telefono: null,
            nombre: null,
          },
          ubicacion: [],
          facturas: [],
          saldo: {
            saldoFavor: 0,
            saldoPendiente: 0,
            ultimoPago: null,
          },
          totalDebe: 0,
        },
      ],
    });

    expect(result.clientes[0].ubicacion).toBeNull();
  });

  test("acepta el resumen de rutas asignadas usado por produccion", () => {
    const result = assignedRoutesResponseSchema.parse({
      rutas: [
        {
          id: 1,
          nombreRuta: "Ruta Norte",
          creadoEn: "2026-09-28T10:00:00.000Z",
          actualizadoEn: "2026-09-28T10:00:00.000Z",
          observaciones: null,
          cobrador: {
            id: 7,
            nombre: "Cobrador",
            rol: "COBRADOR",
          },
          _count: {
            clientes: 12,
          },
          clientes: [],
        },
      ],
      totales: {
        totalRutas: 1,
        totalClientes: 12,
      },
    });

    expect(result.rutas[0]._count.clientes).toBe(12);
    expect(result.totales.totalClientes).toBe(12);
  });
});
