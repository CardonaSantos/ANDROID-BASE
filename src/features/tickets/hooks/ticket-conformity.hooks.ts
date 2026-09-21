import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ticketsQueryKeys } from "../application/tickets.query";

import {
  generateTicketConformityLinkMutationOptions,
  prepareTicketConformityMutationOptions,
  registerClientSignatureMutationOptions,
  registerTechnicianSignatureMutationOptions,
} from "../application/ticket-conformity.mutations";

import {
  currentTicketConformityQueryOptions,
  ticketConformityQueryKeys,
} from "../application/ticket-conformity.query";

async function invalidateTicketConformitySurfaces(
  queryClient: ReturnType<typeof useQueryClient>,
  ticketId: number,
) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ticketConformityQueryKeys.current(ticketId),
    }),
    queryClient.invalidateQueries({
      queryKey: ticketsQueryKeys.detail(ticketId),
    }),
    queryClient.invalidateQueries({
      queryKey: ticketsQueryKeys.assigned(),
    }),
  ]);
}

export function useCurrentTicketConformityQuery(
  ticketId: number,
  enabled = true,
) {
  const validTicketId = Number.isInteger(ticketId) && ticketId > 0;

  return useQuery({
    ...currentTicketConformityQueryOptions(ticketId),
    enabled: enabled && validTicketId,
  });
}

export function usePrepareTicketConformityMutation(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    ...prepareTicketConformityMutationOptions(ticketId),
    onSuccess: async (data) => {
      queryClient.setQueryData(
        ticketConformityQueryKeys.current(ticketId),
        data,
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ticketsQueryKeys.detail(ticketId) }),
        queryClient.invalidateQueries({ queryKey: ticketsQueryKeys.assigned() }),
      ]);
    },
  });
}

export function useGenerateTicketConformityLinkMutation() {
  return useMutation(generateTicketConformityLinkMutationOptions());
}

export function useRegisterTechnicianSignatureMutation(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    ...registerTechnicianSignatureMutationOptions(),
    onSuccess: async () => {
      await invalidateTicketConformitySurfaces(queryClient, ticketId);
    },
  });
}

export function useRegisterClientSignatureMutation(ticketId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    ...registerClientSignatureMutationOptions(),
    onSuccess: async () => {
      await invalidateTicketConformitySurfaces(queryClient, ticketId);
    },
  });
}
