import type { ZodType } from "zod";

import { AppError } from "@/core/errors";
import { httpClient } from "@/core/http";

import {
  createTicketConformityResponseSchema,
  generateTicketConformityLinkResponseSchema,
  registerClientSignatureResponseSchema,
  registerTechnicianSignatureResponseSchema,
  ticketConformityDetailSchema,
  type CreateTicketConformityResponse,
  type GenerateTicketConformityLinkResponse,
  type RegisterClientSignatureResponse,
  type RegisterTechnicianSignatureResponse,
  type TicketConformityChannel,
  type TicketConformityDetail,
} from "./ticket-conformity.contracts.api";

/*
 * =========================================================
 * FILE
 * =========================================================
 *
 * Igual que installation-evidence.api.ts, esta capa no conoce
 * la librería que capturó la firma. Sólo recibe un descriptor
 * normalizado de archivo.
 * =========================================================
 */

export interface TicketSignatureUploadFile {
  uri: string;
  name: string;
  mimeType: string;
  webFile?: Blob;
}

export interface GenerateTicketConformityLinkInput {
  canal: TicketConformityChannel;
  telefonoDestino?: string | null;
}

export interface RegisterTechnicianSignatureInput {
  conformityId: number;
  file: TicketSignatureUploadFile;
}

export interface RegisterClientSignatureInput {
  token: string;
  nombreFirmante: string;
  telefonoFirmante: string;
  file: TicketSignatureUploadFile;
}

/*
 * =========================================================
 * PARSER
 * =========================================================
 */

function parseResponse<T>(schema: ZodType<T>, payload: unknown, code: string): T {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new AppError({
      kind: "server",
      source: "application",
      code,
      message: "El servidor devolvió una respuesta de conformidad inválida.",
      details: result.error.issues,
    });
  }

  return result.data;
}

function assertPositiveInteger(value: number, field: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError({
      kind: "bad_request",
      source: "application",
      code: "TICKET_CONFORMITY_INVALID_INPUT",
      message: `${field} debe ser un entero positivo.`,
    });
  }
}

function assertToken(token: string): string {
  const normalized = token.trim();

  if (!normalized) {
    throw new AppError({
      kind: "bad_request",
      source: "application",
      code: "TICKET_CONFORMITY_TOKEN_REQUIRED",
      message: "La sesión de firma no contiene un token válido.",
    });
  }

  return normalized;
}

function appendFile(formData: FormData, field: string, file: TicketSignatureUploadFile) {
  if (file.webFile) {
    formData.append(field, file.webFile, file.name);
    return;
  }

  const nativeFile = {
    uri: file.uri,
    name: file.name,
    type: file.mimeType,
  };

  formData.append(field, nativeFile as unknown as Blob);
}

/*
 * =========================================================
 * CURRENT
 * =========================================================
 */

export async function getCurrentTicketConformity(
  ticketId: number,
  signal?: AbortSignal,
): Promise<TicketConformityDetail> {
  assertPositiveInteger(ticketId, "ticketId");

  const payload = await httpClient.request<unknown>({
    method: "GET",
    path: `ticket-soporte-conformidad/tickets/${ticketId}/actual`,
    auth: "auto",
    signal,
  });

  return parseResponse(
    ticketConformityDetailSchema,
    payload,
    "TICKET_CONFORMITY_CURRENT_INVALID_RESPONSE",
  );
}

/*
 * =========================================================
 * CREATE CYCLE
 * =========================================================
 */

export async function createTicketConformity(
  ticketId: number,
): Promise<CreateTicketConformityResponse> {
  assertPositiveInteger(ticketId, "ticketId");

  const payload = await httpClient.request<unknown>({
    method: "POST",
    path: `ticket-soporte-conformidad/tickets/${ticketId}`,
    auth: "auto",
  });

  return parseResponse(
    createTicketConformityResponseSchema,
    payload,
    "TICKET_CONFORMITY_CREATE_INVALID_RESPONSE",
  );
}

/*
 * =========================================================
 * GENERATE PUBLIC TOKEN
 * =========================================================
 *
 * Android consume el token internamente. No abre URL ni WebView.
 * El backend continúa usando exactamente el mismo contrato actual.
 * =========================================================
 */

export async function generateTicketConformityLink(
  conformityId: number,
  input: GenerateTicketConformityLinkInput,
): Promise<GenerateTicketConformityLinkResponse> {
  assertPositiveInteger(conformityId, "conformityId");

  const payload = await httpClient.request<unknown, GenerateTicketConformityLinkInput>({
    method: "POST",
    path: `ticket-soporte-conformidad/${conformityId}/enlaces`,
    body: input,
    auth: "auto",
  });

  return parseResponse(
    generateTicketConformityLinkResponseSchema,
    payload,
    "TICKET_CONFORMITY_LINK_INVALID_RESPONSE",
  );
}

/*
 * =========================================================
 * TECHNICIAN SIGNATURE
 * =========================================================
 */

export async function registerTechnicianTicketSignature(
  input: RegisterTechnicianSignatureInput,
): Promise<RegisterTechnicianSignatureResponse> {
  assertPositiveInteger(input.conformityId, "conformityId");

  const formData = new FormData();
  appendFile(formData, "firma", input.file);

  const payload = await httpClient.request<unknown, FormData>({
    method: "POST",
    path: `ticket-soporte-conformidad/${input.conformityId}/firma-tecnico`,
    body: formData,
    auth: "auto",
  });

  return parseResponse(
    registerTechnicianSignatureResponseSchema,
    payload,
    "TICKET_TECHNICIAN_SIGNATURE_INVALID_RESPONSE",
  );
}

/*
 * =========================================================
 * CLIENT SIGNATURE
 * =========================================================
 *
 * Sigue siendo endpoint público porque el servidor actual exige
 * token. La APP nunca expone ni navega a /conformidad/:token.
 * =========================================================
 */

export async function registerClientTicketSignature(
  input: RegisterClientSignatureInput,
): Promise<RegisterClientSignatureResponse> {
  const token = assertToken(input.token);

  const formData = new FormData();

  formData.append("nombreFirmante", input.nombreFirmante.trim());
  formData.append("telefonoFirmante", input.telefonoFirmante.trim());
  appendFile(formData, "firma", input.file);

  const payload = await httpClient.request<unknown, FormData>({
    method: "POST",
    path: `ticket-soporte-conformidad/public/${encodeURIComponent(token)}/firma`,
    body: formData,
    auth: "none",
  });

  return parseResponse(
    registerClientSignatureResponseSchema,
    payload,
    "TICKET_CLIENT_SIGNATURE_INVALID_RESPONSE",
  );
}
