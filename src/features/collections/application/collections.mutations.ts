import { mutationOptions } from "@tanstack/react-query";

import { createCollectionPayment } from "../api/collections.api";
import type { CreateCollectionPaymentInput } from "../api/collections.contracts.api";

export const collectionsMutationKeys = {
  all: ["collections", "mutations"] as const,
  createPayment: () => [...collectionsMutationKeys.all, "create-payment"] as const,
};

export function createCollectionPaymentMutationOptions() {
  return mutationOptions({
    mutationKey: collectionsMutationKeys.createPayment(),
    mutationFn: (input: CreateCollectionPaymentInput) =>
      createCollectionPayment(input),
  });
}
