import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCollectionPaymentMutationOptions } from "../application/collections.mutations";
import { collectionsQueryKeys } from "../application/collections.query";

export function useCreateCollectionPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...createCollectionPaymentMutationOptions(),

    onSuccess: async (_response, input) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: collectionsQueryKeys.detail(input.rutaId),
        }),
        queryClient.invalidateQueries({
          queryKey: collectionsQueryKeys.assigned(),
        }),
      ]);
    },
  });
}
