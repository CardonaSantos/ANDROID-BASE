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
 * Estos tipos representan exactamente los cuerpos HTTP
 * consumidos por los endpoints operativos del servidor.
 *
 * Las fechas viajan como ISO strings.
 * =========================================================
 */

export interface StartInstallationRequest {
  fechaInicio?: string;
}

export interface ReprogramInstallationRequest {
  fechaProgramada: string;

  motivo?: string | null;
}

export interface CompleteInstallationRequest {
  resultado?: string | null;

  observaciones?: string | null;

  fechaFinalizacion?: string;

  activarServicio?: boolean;
}

export interface CancelInstallationRequest {
  motivo: string;

  observaciones?: string | null;

  fechaCancelacion?: string;
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
 * En estas operaciones no necesitamos consumir el presenter
 * general que retorna el servidor.
 *
 * Después de una mutación TanStack invalidará:
 *
 * - detalle técnico;
 * - bandeja asignada.
 *
 * Por lo tanto volvemos a consultar los endpoints técnicos
 * canónicos en lugar de mantener dos contratos de detalle.
 * =========================================================
 */

/*
 * =========================================================
 * INICIAR
 * =========================================================
 *
 * POST cliente-instalaciones/iniciar/:id
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
 * REPROGRAMAR
 * =========================================================
 *
 * PATCH cliente-instalaciones/reprogramar/:id
 * =========================================================
 */

export async function reprogramInstallation(
  installationId: number,

  input: ReprogramInstallationRequest,
): Promise<void> {
  await httpClient.request<unknown, ReprogramInstallationRequest>({
    method: "PATCH",

    path: `cliente-instalaciones/reprogramar/${installationId}`,

    body: input,

    auth: "auto",
  });
}

/*
 * =========================================================
 * COMPLETAR
 * =========================================================
 *
 * POST cliente-instalaciones/completar/:id
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

/*
 * =========================================================
 * CANCELAR
 * =========================================================
 *
 * POST cliente-instalaciones/cancelar/:id
 * =========================================================
 */

export async function cancelInstallation(
  installationId: number,

  input: CancelInstallationRequest,
): Promise<void> {
  await httpClient.request<unknown, CancelInstallationRequest>({
    method: "POST",

    path: `cliente-instalaciones/cancelar/${installationId}`,

    body: input,

    auth: "auto",
  });
}
