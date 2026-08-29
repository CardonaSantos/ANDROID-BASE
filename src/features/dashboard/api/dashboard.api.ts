import type { ZodType } from "zod";

import { AppError } from "@/core/errors";

import { httpClient } from "@/core/http";

import {
  technicianPanelResponseSchema,
  type TechnicianPanelResponse,
} from "./dashboard.contracts";

function parseDashboardResponse<T>(
  schema: ZodType<T>,
  payload: unknown,
  code: string,
): T {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new AppError({
      kind: "server",

      source: "application",

      code,

      message: "El servidor devolvió una respuesta de dashboard inválida.",

      details: result.error.issues,
    });
  }

  return result.data;
}

export async function getTechnicianPanel(
  signal?: AbortSignal,
): Promise<TechnicianPanelResponse> {
  const payload = await httpClient.request<unknown>({
    method: "GET",

    path: "dashboard/panel-tecnico",

    auth: "auto",

    signal,
  });

  return parseDashboardResponse(
    technicianPanelResponseSchema,
    payload,
    "TECHNICIAN_DASHBOARD_INVALID_RESPONSE",
  );
}
