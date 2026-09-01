import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  completeInstallationMutationOptions,
  startInstallationMutationOptions,
} from "../application/installations.mutations";

import { installationsQueryKeys } from "../application/installations.query";

/*
 * =========================================================
 * CACHE INVALIDATION
 * =========================================================
 *
 * Android únicamente soporta:
 *
 * - iniciar;
 * - completar.
 *
 * Ambas operaciones pueden modificar:
 *
 * - estado;
 * - agenda;
 * - trabajo;
 * - acciones habilitadas;
 * - información visible en la bandeja.
 * =========================================================
 */

async function invalidateInstallationAfterMutation(
  queryClient: ReturnType<typeof useQueryClient>,

  installationId: number,
) {
  await Promise.all([
    /*
     * Detalle técnico actual.
     */
    queryClient.invalidateQueries({
      queryKey: installationsQueryKeys.detail(installationId),
    }),

    /*
     * Todas las variantes de la bandeja:
     *
     * search
     * estado
     * fechas
     * paginación
     */
    queryClient.invalidateQueries({
      queryKey: installationsQueryKeys.assigned(),
    }),
  ]);
}

/*
 * =========================================================
 * INICIAR
 * =========================================================
 */

export function useStartInstallationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...startInstallationMutationOptions(),

    onSuccess: async (_response, variables) => {
      await invalidateInstallationAfterMutation(
        queryClient,

        variables.installationId,
      );
    },
  });
}

/*
 * =========================================================
 * COMPLETAR
 * =========================================================
 */

export function useCompleteInstallationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...completeInstallationMutationOptions(),

    onSuccess: async (_response, variables) => {
      await invalidateInstallationAfterMutation(
        queryClient,

        variables.installationId,
      );
    },
  });
}
