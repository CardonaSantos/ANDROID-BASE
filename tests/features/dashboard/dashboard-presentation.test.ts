import { describe, expect, test } from "@jest/globals";

import {
  formatMinutesDuration,
  getTechnicianPendingWork,
  hasTechnicianPriorityAttention,
} from "@/features/dashboard/presentation/technician-dashboard.utils";

const workload = {
  ticketsPendientes: 8,

  ticketsListosParaTrabajar: 5,

  ticketsUrgentes: 2,

  ticketsConMas48Horas: 1,

  instalacionesPendientes: 4,

  instalacionesProgramadasHoy: 2,

  instalacionesAtrasadas: 1,
};

describe("technician dashboard presentation", () => {
  test("calcula el trabajo pendiente", () => {
    expect(getTechnicianPendingWork(workload)).toBe(12);
  });

  test("detecta trabajo prioritario", () => {
    expect(hasTechnicianPriorityAttention(workload)).toBe(true);
  });

  test("formatea minutos", () => {
    expect(formatMinutesDuration(45)).toBe("45 min");

    expect(formatMinutesDuration(65)).toBe("1 h 5 min");

    expect(formatMinutesDuration(null)).toBe("Sin datos");
  });
});
