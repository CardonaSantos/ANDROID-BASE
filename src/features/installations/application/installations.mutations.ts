import { mutationOptions } from "@tanstack/react-query";

import {
  completeInstallation,
  startInstallation,
  type CompleteInstallationRequest,
  type StartInstallationRequest,
} from "../api/installations.api";

/*
 * =========================================================
 * VARIABLES
 * =========================================================
 */

export interface StartInstallationVariables {
  installationId: number;

  input?: StartInstallationRequest;
}

export interface CompleteInstallationVariables {
  installationId: number;

  input: CompleteInstallationRequest;
}

/*
 * =========================================================
 * MUTATION KEYS
 * =========================================================
 *
 * La aplicación móvil únicamente expone:
 *
 * - start;
 * - complete.
 * =========================================================
 */

export const installationsMutationKeys = {
  all: ["installations", "mutations"] as const,

  start: () => [...installationsMutationKeys.all, "start"] as const,

  complete: () => [...installationsMutationKeys.all, "complete"] as const,
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
