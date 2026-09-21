import { queryOptions } from "@tanstack/react-query";

import { getCurrentTicketConformity } from "../api/ticket-conformity.api";

export const ticketConformityQueryKeys = {
  all: ["tickets", "conformity"] as const,
  current: (ticketId: number) =>
    [...ticketConformityQueryKeys.all, "current", ticketId] as const,
};

export function currentTicketConformityQueryOptions(ticketId: number) {
  return queryOptions({
    queryKey: ticketConformityQueryKeys.current(ticketId),
    queryFn: ({ signal }) => getCurrentTicketConformity(ticketId, signal),
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
