import { queryOptions } from "@tanstack/react-query";

import { getCustomerProfile } from "../api/customers.api";

export const customersQueryKeys = {
  all: ["customers"] as const,
  details: () => [...customersQueryKeys.all, "detail"] as const,
  detail: (customerId: number) =>
    [...customersQueryKeys.details(), customerId] as const,
};

export function customerProfileQueryOptions(customerId: number) {
  return queryOptions({
    queryKey: customersQueryKeys.detail(customerId),
    queryFn: ({ signal }) => getCustomerProfile(customerId, signal),
    enabled: Number.isInteger(customerId) && customerId > 0,
    staleTime: 30_000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: 1,
  });
}
