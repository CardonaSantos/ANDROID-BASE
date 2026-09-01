import type { ZodType } from "zod";

import { AppError } from "@/core/errors";

import { httpClient } from "@/core/http";

import {
  assignedInstallationsResponseSchema,
  installationTechnicalDetailSchema,
  type AssignedInstallationsParams,
  type AssignedInstallationsResponse,
  type InstallationTechnicalDetail,
} from "./installations.contracts.api";

/*
 * =========================================================
 * MUTATION REQUESTS
 * =========================================================
 *
 * Android únicamente soporta las operaciones técnicas
 * incluidas en su flujo de campo:
 *
 * - iniciar;
 * - completar.
 *
 * Reprogramar y cancelar no forman parte de la app móvil.
 * =========================================================
 */

export interface StartInstallationRequest {
  fechaInicio?: string;
}

export interface CompleteInstallationRequest {
  resultado?: string | null;

  observaciones?: string | null;

  fechaFinalizacion?: string;

  /*
   * El contrato HTTP todavía permite este campo.
   *
   * La UI móvil actual no lo utiliza porque completar
   * la instalación y activar el servicio son operaciones
   * independientes.
   */
  activarServicio?: boolean;
}

/*
 * =========================================================
 * RESPONSE PARSING
 * =========================================================
 */

function parseInstallationsResponse<T>(
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

      message: "El servidor devolvió una respuesta de instalaciones inválida.",

      details: result.error.issues,
    });
  }

  return result.data;
}

/*
 * =========================================================
 * QUERIES
 * =========================================================
 */

/*
 * =========================================================
 * MIS INSTALACIONES ASIGNADAS
 * =========================================================
 */

export async function getAssignedInstallations(
  params: AssignedInstallationsParams = {},

  signal?: AbortSignal,
): Promise<AssignedInstallationsResponse> {
  const payload = await httpClient.request<
    unknown,
    never,
    AssignedInstallationsParams
  >({
    method: "GET",

    path: "cliente-instalaciones/mis-asignadas",

    params,

    auth: "auto",

    signal,
  });

  return parseInstallationsResponse(
    assignedInstallationsResponseSchema,

    payload,

    "ASSIGNED_INSTALLATIONS_INVALID_RESPONSE",
  );
}

/*
 * =========================================================
 * DETALLE TÉCNICO
 * =========================================================
 */

export async function getInstallationTechnicalDetail(
  installationId: number,

  signal?: AbortSignal,
): Promise<InstallationTechnicalDetail> {
  const payload = await httpClient.request<unknown>({
    method: "GET",

    path: `cliente-instalaciones/${installationId}/tecnica`,

    auth: "auto",

    signal,
  });

  return parseInstallationsResponse(
    installationTechnicalDetailSchema,

    payload,

    "INSTALLATION_TECHNICAL_DETAIL_INVALID_RESPONSE",
  );
}

/*
 * =========================================================
 * MUTATIONS
 * =========================================================
 *
 * Las respuestas de estas operaciones no se mantienen
 * directamente en caché.
 *
 * Después de cada mutación los hooks invalidan:
 *
 * - detalle técnico;
 * - bandeja de instalaciones asignadas.
 *
 * El endpoint técnico vuelve a ser la fuente de verdad.
 * =========================================================
 */

/*
 * =========================================================
 * INICIAR
 * =========================================================
 */

export async function startInstallation(
  installationId: number,

  input: StartInstallationRequest = {},
): Promise<void> {
  await httpClient.request<unknown, StartInstallationRequest>({
    method: "POST",

    path: `cliente-instalaciones/iniciar/${installationId}`,

    body: input,

    auth: "auto",
  });
}

/*
 * =========================================================
 * COMPLETAR
 * =========================================================
 */

export async function completeInstallation(
  installationId: number,

  input: CompleteInstallationRequest,
): Promise<void> {
  await httpClient.request<unknown, CompleteInstallationRequest>({
    method: "POST",

    path: `cliente-instalaciones/completar/${installationId}`,

    body: input,

    auth: "auto",
  });
}
