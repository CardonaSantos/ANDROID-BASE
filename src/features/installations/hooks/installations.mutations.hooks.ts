import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  cancelInstallationMutationOptions,
  completeInstallationMutationOptions,
  reprogramInstallationMutationOptions,
  startInstallationMutationOptions,
} from "../application/installations.mutations";

import { installationsQueryKeys } from "../application/installations.query";

/*
 * =========================================================
 * CACHE INVALIDATION
 * =========================================================
 *
 * Toda operación sobre una instalación puede modificar:
 *
 * - estado;
 * - agenda;
 * - trabajo;
 * - acciones habilitadas;
 * - datos visibles en la bandeja.
 *
 * Por eso actualizamos tanto:
 *
 * detalle técnico
 * +
 * todas las variantes del listado asignado.
 * =========================================================
 */

async function invalidateInstallationAfterMutation(
  queryClient: ReturnType<typeof useQueryClient>,

  installationId: number,
) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: installationsQueryKeys.detail(installationId),
    }),

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
 * REPROGRAMAR
 * =========================================================
 */

export function useReprogramInstallationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...reprogramInstallationMutationOptions(),

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

/*
 * =========================================================
 * CANCELAR
 * =========================================================
 */

export function useCancelInstallationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...cancelInstallationMutationOptions(),

    onSuccess: async (_response, variables) => {
      await invalidateInstallationAfterMutation(
        queryClient,

        variables.installationId,
      );
    },
  });
}
