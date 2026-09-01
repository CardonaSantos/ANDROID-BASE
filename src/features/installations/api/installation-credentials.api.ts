import { z } from "zod";

import { AppError } from "@/core/errors";

import { httpClient } from "@/core/http";

/*
 * =========================================================
 * PPPoE ACCOUNT STATUS
 * =========================================================
 *
 * Contrato actual del servidor.
 * =========================================================
 */

export const installationPppoeAccountStatusSchema = z.enum([
  "PENDIENTE_CREACION",
  "EN_INSTALACION",
  "PENDIENTE_ACTIVACION",
  "EN_ACTIVACION",
  "ACTIVA",
  "EN_SUSPENSION",
  "SUSPENDIDA",
  "EN_DESINSTALACION",
  "ELIMINADA",
  "CANCELADA",
  "ERROR",
]);

export type InstallationPppoeAccountStatus = z.infer<
  typeof installationPppoeAccountStatusSchema
>;

/*
 * =========================================================
 * CREDENTIAL
 * =========================================================
 *
 * IMPORTANTE:
 *
 * `contrasena` es información sensible.
 *
 * Este contrato NO implica que deba:
 *
 * - almacenarse;
 * - persistirse;
 * - cachearse;
 * - registrarse en logs.
 *
 * Solamente valida el payload recibido.
 * =========================================================
 */

export const installationPppoeCredentialSchema = z.object({
  cuentaPppoeId: z.number().int().positive(),

  accesoInternetId: z.number().int().positive(),

  perfilHomologacionId: z.number().int().positive(),

  mikrotikRouterId: z.number().int().positive(),

  servicioInternetId: z.number().int().positive(),

  codigoPerfil: z.string().min(1),

  usuario: z.string().min(1),

  /*
   * Contraseña descifrada temporalmente.
   */
  contrasena: z.string().min(1),

  estadoCuenta: installationPppoeAccountStatusSchema,

  /*
   * El controller serializa Date mediante:
   *
   * generadoEn.toISOString()
   */
  generadoEn: z.string().datetime(),
});

export type InstallationPppoeCredential = z.infer<
  typeof installationPppoeCredentialSchema
>;

/*
 * =========================================================
 * RESPONSE
 * =========================================================
 */

export const revealInstallationPppoeCredentialsResponseSchema = z.object({
  instalacionId: z.number().int().positive(),

  /*
   * Es arreglo deliberadamente.
   *
   * Una instalación puede resolver más de una
   * credencial PPPoE.
   */
  credenciales: z.array(installationPppoeCredentialSchema),
});

export type RevealInstallationPppoeCredentialsResponse = z.infer<
  typeof revealInstallationPppoeCredentialsResponseSchema
>;

/*
 * =========================================================
 * VALIDATION
 * =========================================================
 */

function assertInstallationId(installationId: number) {
  if (!Number.isInteger(installationId) || installationId <= 0) {
    throw new AppError({
      kind: "bad_request",

      source: "application",

      code: "INSTALLATION_PPPOE_INVALID_INSTALLATION_ID",

      message: "El identificador de la instalación no es válido.",
    });
  }
}

/*
 * =========================================================
 * REVEAL CREDENTIALS
 * =========================================================
 *
 * POST
 *
 * /cliente-instalaciones/:instalacionId/
 * credenciales-pppoe/revelar
 *
 * Sin body.
 *
 * IMPORTANTE:
 *
 * - no loggear payload;
 * - no guardar response;
 * - no Query Cache;
 * - no SecureStore;
 * - no SQLite;
 * - no preferences.
 * =========================================================
 */

export async function revealInstallationPppoeCredentials(
  installationId: number,
): Promise<RevealInstallationPppoeCredentialsResponse> {
  assertInstallationId(installationId);

  const payload = await httpClient.request<unknown>({
    method: "POST",

    path: `cliente-instalaciones/${installationId}/credenciales-pppoe/revelar`,

    auth: "auto",
  });

  /*
   * No imprimir payload ni error completo de parsing.
   *
   * Zod issues describen estructura, no copiamos
   * manualmente ningún valor sensible.
   */

  const result =
    revealInstallationPppoeCredentialsResponseSchema.safeParse(payload);

  if (!result.success) {
    throw new AppError({
      kind: "server",

      source: "application",

      code: "INSTALLATION_PPPOE_CREDENTIALS_INVALID_RESPONSE",

      message:
        "El servidor devolvió las credenciales PPPoE con un formato inválido.",

      /*
       * No incluimos `payload` en details.
       *
       * Podría contener la contraseña descifrada.
       */
      details: result.error.issues,
    });
  }

  return result.data;
}
