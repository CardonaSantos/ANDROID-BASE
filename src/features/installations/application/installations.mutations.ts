import { mutationOptions } from "@tanstack/react-query";

import {
  cancelInstallation,
  completeInstallation,
  reprogramInstallation,
  startInstallation,
  type CancelInstallationRequest,
  type CompleteInstallationRequest,
  type ReprogramInstallationRequest,
  type StartInstallationRequest,
} from "../api/installations.api";

/*
 * =========================================================
 * VARIABLES
 * =========================================================
 *
 * Las mutations reciben objetos y no argumentos posicionales.
 *
 * Esto escala mejor cuando cada operación tiene:
 *
 * installationId
 * +
 * DTO específico
 * =========================================================
 */

export interface StartInstallationVariables {
  installationId: number;

  input?: StartInstallationRequest;
}

export interface ReprogramInstallationVariables {
  installationId: number;

  input: ReprogramInstallationRequest;
}

export interface CompleteInstallationVariables {
  installationId: number;

  input: CompleteInstallationRequest;
}

export interface CancelInstallationVariables {
  installationId: number;

  input: CancelInstallationRequest;
}

/*
 * =========================================================
 * MUTATION KEYS
 * =========================================================
 */

export const installationsMutationKeys = {
  all: ["installations", "mutations"] as const,

  start: () => [...installationsMutationKeys.all, "start"] as const,

  reprogram: () => [...installationsMutationKeys.all, "reprogram"] as const,

  complete: () => [...installationsMutationKeys.all, "complete"] as const,

  cancel: () => [...installationsMutationKeys.all, "cancel"] as const,
};

/*
 * =========================================================
 * INICIAR
 * =========================================================
 */

export function startInstallationMutationOptions() {
  return mutationOptions({
    mutationKey: installationsMutationKeys.start(),

    mutationFn: ({ installationId, input }: StartInstallationVariables) =>
      startInstallation(
        installationId,

        input,
      ),
  });
}

/*
 * =========================================================
 * REPROGRAMAR
 * =========================================================
 */

export function reprogramInstallationMutationOptions() {
  return mutationOptions({
    mutationKey: installationsMutationKeys.reprogram(),

    mutationFn: ({ installationId, input }: ReprogramInstallationVariables) =>
      reprogramInstallation(
        installationId,

        input,
      ),
  });
}

/*
 * =========================================================
 * COMPLETAR
 * =========================================================
 */

export function completeInstallationMutationOptions() {
  return mutationOptions({
    mutationKey: installationsMutationKeys.complete(),

    mutationFn: ({ installationId, input }: CompleteInstallationVariables) =>
      completeInstallation(
        installationId,

        input,
      ),
  });
}

/*
 * =========================================================
 * CANCELAR
 * =========================================================
 */

export function cancelInstallationMutationOptions() {
  return mutationOptions({
    mutationKey: installationsMutationKeys.cancel(),

    mutationFn: ({ installationId, input }: CancelInstallationVariables) =>
      cancelInstallation(
        installationId,

        input,
      ),
  });
}
