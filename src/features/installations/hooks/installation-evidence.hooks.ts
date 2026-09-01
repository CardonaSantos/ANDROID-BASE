import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  uploadInstallationEvidence,
  type UploadInstallationEvidenceInput,
} from "../api/installation-evidence.api";

import { installationsQueryKeys } from "../application/installations.query";

/*
 * =========================================================
 * MUTATION KEYS
 * =========================================================
 */

export const installationEvidenceMutationKeys = {
  all: ["installations", "evidence", "mutations"] as const,

  upload: () => [...installationEvidenceMutationKeys.all, "upload"] as const,
};

/*
 * =========================================================
 * INVALIDATION
 * =========================================================
 *
 * Subir evidencia modifica:
 *
 * - installation.evidencias;
 * - conteo de evidencias del detalle;
 * - conteo mostrado en /mis-asignadas.
 *
 * Por eso actualizamos ambas superficies.
 * =========================================================
 */

async function invalidateInstallationEvidence(
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
 * UPLOAD
 * =========================================================
 */

export function useUploadInstallationEvidenceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: installationEvidenceMutationKeys.upload(),

    mutationFn: (input: UploadInstallationEvidenceInput) =>
      uploadInstallationEvidence(input),

    onSuccess: async (_response, variables) => {
      await invalidateInstallationEvidence(
        queryClient,

        variables.installationId,
      );
    },
  });
}
