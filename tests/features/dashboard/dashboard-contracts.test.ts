import { describe, expect, test } from "@jest/globals";

import { technicianPanelResponseSchema } from "@/features/dashboard/api/dashboard.contracts";

function createPanel() {
  return {
    tecnico: {
      id: 7,

      nombre: "Técnico de prueba",

      correo: "tecnico@example.com",

      rol: "TECNICO",

      activo: true,
    },

    periodo: {
      inicioMes: "2026-08-01T06:00:00.000Z",

      finMes: "2026-09-01T05:59:59.999Z",

      diasTranscurridos: 29,

      zonaHoraria: "America/Guatemala",
    },

    cargaActual: {
      ticketsPendientes: 8,

      ticketsListosParaTrabajar: 5,

      ticketsUrgentes: 2,

      ticketsConMas48Horas: 1,

      instalacionesPendientes: 4,

      instalacionesProgramadasHoy: 2,

      instalacionesAtrasadas: 1,
    },

    productividadMes: {
      ticketsResueltos: 12,

      instalacionesCompletadas: 6,

      trabajosCompletados: 18,

      diasConActividad: 10,

      promedioTicketsPorDia: 1.2,

      ritmoSemanalTickets: 4.5,

      promedioTrabajosPorDiaActivo: 1.8,
    },

    tiempos: {
      promedioResolucionTicketMinutos: 95,

      promedioInstalacionMinutos: 130,
    },

    resumenActividad: {
      diaMasProductivo: {
        fecha: "2026-08-28",

        etiqueta: "28 ago",

        tickets: 3,

        instalaciones: 2,

        total: 5,
      },

      diaMenosProductivoConActividad: null,
    },

    actividadDiaria: [],
  };
}

describe("technician dashboard contract", () => {
  test("acepta una respuesta válida", () => {
    const result = technicianPanelResponseSchema.safeParse(createPanel());

    expect(result.success).toBe(true);
  });

  test("rechaza cantidades negativas", () => {
    const payload = createPanel();

    payload.cargaActual.ticketsPendientes = -1;

    const result = technicianPanelResponseSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });
});
