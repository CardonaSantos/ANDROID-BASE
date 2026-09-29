import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createTicketCommentMutationOptions,
  sendAssignedTicketToReviewMutationOptions,
  startAssignedTicketMutationOptions,
} from "../application/tickets.mutations";

import { ticketsQueryKeys } from "../application/tickets.query";

async function invalidateTicketDetail(
  queryClient: ReturnType<typeof useQueryClient>,
  ticketId: number,
) {
  await queryClient.invalidateQueries({
    queryKey: ticketsQueryKeys.detail(ticketId),
  });
}

async function invalidateTicketAfterLifecycleMutation(
  queryClient: ReturnType<typeof useQueryClient>,
  ticketId: number,
) {
  await Promise.all([
    invalidateTicketDetail(queryClient, ticketId),

    queryClient.invalidateQueries({
      queryKey: ticketsQueryKeys.assigned(),
    }),
  ]);
}

export function useCreateTicketCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...createTicketCommentMutationOptions(),

    onSuccess: async (_response, variables) => {
      await invalidateTicketDetail(queryClient, variables.ticketId);
    },
  });
}

export function useStartAssignedTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...startAssignedTicketMutationOptions(),

    onSuccess: async (_response, ticketId) => {
      await invalidateTicketAfterLifecycleMutation(queryClient, ticketId);
    },
  });
}

export function useSendAssignedTicketToReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...sendAssignedTicketToReviewMutationOptions(),

    onSuccess: async (_response, ticketId) => {
      await invalidateTicketAfterLifecycleMutation(queryClient, ticketId);
    },
  });
}
