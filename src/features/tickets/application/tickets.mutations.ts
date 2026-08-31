import { mutationOptions } from "@tanstack/react-query";

import {
  sendAssignedTicketToReview,
  startAssignedTicket,
} from "../api/tickets.api";

/*
 * =========================================================
 * MUTATION KEYS
 * =========================================================
 */

export const ticketsMutationKeys = {
  all: ["tickets", "mutations"] as const,

  start: () => [...ticketsMutationKeys.all, "start"] as const,

  review: () => [...ticketsMutationKeys.all, "review"] as const,
};

/*
 * =========================================================
 * TOMAR TICKET EN PROCESO
 * =========================================================
 */

export function startAssignedTicketMutationOptions() {
  return mutationOptions({
    mutationKey: ticketsMutationKeys.start(),

    mutationFn: (ticketId: number) => startAssignedTicket(ticketId),
  });
}

/*
 * =========================================================
 * ENVIAR TICKET A REVISIÓN
 * =========================================================
 */

export function sendAssignedTicketToReviewMutationOptions() {
  return mutationOptions({
    mutationKey: ticketsMutationKeys.review(),

    mutationFn: (ticketId: number) => sendAssignedTicketToReview(ticketId),
  });
}
