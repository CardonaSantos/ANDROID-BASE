import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  sendAssignedTicketToReviewMutationOptions,
  startAssignedTicketMutationOptions,
} from "../application/tickets.mutations";

import { ticketsQueryKeys } from "../application/tickets.query";

/*
 * =========================================================
 * CACHE INVALIDATION
 * =========================================================
 *
 * Cualquier cambio de estado afecta:
 *
 * 1. El detalle del ticket.
 * 2. El listado de tickets asignados.
 *
 * Esto replica conceptualmente el comportamiento
 * del CRM Web.
 */

async function invalidateTicketAfterMutation(
  queryClient: ReturnType<typeof useQueryClient>,
  ticketId: number,
) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ticketsQueryKeys.detail(ticketId),
    }),

    queryClient.invalidateQueries({
      queryKey: ticketsQueryKeys.assigned(),
    }),
  ]);
}

/*
 * =========================================================
 * TOMAR TICKET EN PROCESO
 * =========================================================
 */

export function useStartAssignedTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...startAssignedTicketMutationOptions(),

    onSuccess: async (_response, ticketId) => {
      await invalidateTicketAfterMutation(queryClient, ticketId);
    },
  });
}

/*
 * =========================================================
 * ENVIAR TICKET A REVISIÓN
 * =========================================================
 */

export function useSendAssignedTicketToReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...sendAssignedTicketToReviewMutationOptions(),

    onSuccess: async (_response, ticketId) => {
      await invalidateTicketAfterMutation(queryClient, ticketId);
    },
  });
}
