import { AppError } from "@/core/errors";

import { httpClient } from "@/core/http";

import type { InstallationTechnicalEvidence } from "./installations.contracts.api";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type InstallationEvidenceType = InstallationTechnicalEvidence["tipo"];

/*
 * =========================================================
 * FILE
 * =========================================================
 *
 * Normalizamos el archivo seleccionado para no acoplar
 * la API directamente a expo-image-picker.
 *
 * NATIVE:
 *
 * {
 *   uri,
 *   name,
 *   mimeType
 * }
 *
 * WEB:
 *
 * Expo ImagePicker también entrega un File real.
 * Lo almacenaremos como webFile.
 * =========================================================
 */

export interface InstallationEvidenceUploadFile {
  uri: string;

  name: string;

  mimeType: string;

  /*
   * En Web recibiremos el File retornado por
   * expo-image-picker.
   *
   * File implementa Blob, así que Blob es suficiente
   * para mantener esta capa independiente de Expo.
   */
  webFile?: Blob;
}

/*
 * =========================================================
 * INPUT
 * =========================================================
 */

export interface UploadInstallationEvidenceInput {
  installationId: number;

  empresaId: number;

  file: InstallationEvidenceUploadFile;

  tipo: InstallationEvidenceType;

  descripcion?: string | null;

  orden?: number;
}

/*
 * =========================================================
 * VALIDATION
 * =========================================================
 */

function assertPositiveInteger(value: number, field: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError({
      kind: "bad_request",

      source: "application",

      code: "INSTALLATION_EVIDENCE_INVALID_INPUT",

      message: `${field} debe ser un entero positivo.`,
    });
  }
}

function assertUploadFile(file: InstallationEvidenceUploadFile) {
  if (!file.uri.trim() && !file.webFile) {
    throw new AppError({
      kind: "bad_request",

      source: "application",

      code: "INSTALLATION_EVIDENCE_FILE_REQUIRED",

      message: "La evidencia necesita un archivo válido.",
    });
  }

  if (!file.name.trim()) {
    throw new AppError({
      kind: "bad_request",

      source: "application",

      code: "INSTALLATION_EVIDENCE_FILE_NAME_REQUIRED",

      message: "La evidencia necesita un nombre de archivo.",
    });
  }

  if (!file.mimeType.trim()) {
    throw new AppError({
      kind: "bad_request",

      source: "application",

      code: "INSTALLATION_EVIDENCE_MIME_REQUIRED",

      message: "La evidencia necesita un tipo MIME.",
    });
  }
}

/*
 * =========================================================
 * FORM DATA
 * =========================================================
 */

function buildInstallationEvidenceFormData(
  input: UploadInstallationEvidenceInput,
): FormData {
  const formData = new FormData();

  /*
   * =======================================================
   * FILE
   * =======================================================
   *
   * WEB
   *
   * ImagePicker entrega un File real. File extiende Blob
   * y puede añadirse directamente a FormData.
   * =======================================================
   */

  if (input.file.webFile) {
    formData.append(
      "file",

      input.file.webFile,

      input.file.name,
    );
  } else {
    /*
     * =====================================================
     * NATIVE
     * =====================================================
     *
     * React Native / Axios reconoce este descriptor:
     *
     * {
     *   uri,
     *   name,
     *   type
     * }
     *
     * El cast solamente resuelve la diferencia entre la
     * definición DOM de FormData y la implementación nativa.
     * =====================================================
     */

    const nativeFile = {
      uri: input.file.uri,

      name: input.file.name,

      type: input.file.mimeType,
    };

    formData.append(
      "file",

      nativeFile as unknown as Blob,
    );
  }

  /*
   * =======================================================
   * DTO
   * =======================================================
   */

  formData.append(
    "tipo",

    input.tipo,
  );

  const description = input.descripcion?.trim();

  if (description) {
    formData.append(
      "descripcion",

      description,
    );
  }

  if (input.orden !== undefined) {
    if (!Number.isInteger(input.orden) || input.orden < 0) {
      throw new AppError({
        kind: "bad_request",

        source: "application",

        code: "INSTALLATION_EVIDENCE_INVALID_ORDER",

        message:
          "El orden de la evidencia debe ser un entero mayor o igual a cero.",
      });
    }

    formData.append(
      "orden",

      String(input.orden),
    );
  }

  return formData;
}

/*
 * =========================================================
 * UPLOAD
 * =========================================================
 *
 * POST
 *
 * /cliente-instalaciones/:id/evidencias/upload
 *
 * query:
 *
 * empresaId
 *
 * multipart:
 *
 * file
 * tipo
 * descripcion?
 * orden?
 * =========================================================
 */

export async function uploadInstallationEvidence(
  input: UploadInstallationEvidenceInput,
): Promise<void> {
  assertPositiveInteger(
    input.installationId,

    "installationId",
  );

  assertPositiveInteger(
    input.empresaId,

    "empresaId",
  );

  assertUploadFile(input.file);

  const formData = buildInstallationEvidenceFormData(input);

  await httpClient.request<
    unknown,
    FormData,
    {
      empresaId: number;
    }
  >({
    method: "POST",

    path: `cliente-instalaciones/${input.installationId}/evidencias/upload`,

    params: {
      empresaId: input.empresaId,
    },

    body: formData,

    auth: "auto",

    /*
     * IMPORTANTE:
     *
     * No establecer manualmente:
     *
     * Content-Type: multipart/form-data
     *
     * Axios / navegador / React Native deben generar
     * automáticamente el boundary correcto.
     */
  });
}
