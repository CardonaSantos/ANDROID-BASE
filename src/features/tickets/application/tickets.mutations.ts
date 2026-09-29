import { mutationOptions } from "@tanstack/react-query";

import {
  createTicketComment,
  sendAssignedTicketToReview,
  startAssignedTicket,
} from "../api/tickets.api";

import type { CreateTicketCommentInput } from "../api/tickets.contracts.api";

export const ticketsMutationKeys = {
  all: ["tickets", "mutations"] as const,

  start: () => [...ticketsMutationKeys.all, "start"] as const,

  review: () => [...ticketsMutationKeys.all, "review"] as const,

  comment: () => [...ticketsMutationKeys.all, "comment"] as const,
};

export function createTicketCommentMutationOptions() {
  return mutationOptions({
    mutationKey: ticketsMutationKeys.comment(),

    mutationFn: (input: CreateTicketCommentInput) => createTicketComment(input),
  });
}

export function startAssignedTicketMutationOptions() {
  return mutationOptions({
    mutationKey: ticketsMutationKeys.start(),

    mutationFn: (ticketId: number) => startAssignedTicket(ticketId),
  });
}

export function sendAssignedTicketToReviewMutationOptions() {
  return mutationOptions({
    mutationKey: ticketsMutationKeys.review(),

    mutationFn: (ticketId: number) => sendAssignedTicketToReview(ticketId),
  });
}
