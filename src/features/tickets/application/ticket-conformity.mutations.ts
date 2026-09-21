import { mutationOptions } from "@tanstack/react-query";

import {
  generateTicketConformityLink,
  registerClientTicketSignature,
  registerTechnicianTicketSignature,
  type GenerateTicketConformityLinkInput,
  type RegisterClientSignatureInput,
  type RegisterTechnicianSignatureInput,
} from "../api/ticket-conformity.api";

import { prepareTicketConformity } from "./ticket-conformity.actions";

export interface GenerateTicketConformityLinkVariables {
  conformityId: number;
  input: GenerateTicketConformityLinkInput;
}

export const ticketConformityMutationKeys = {
  all: ["tickets", "conformity", "mutations"] as const,
  prepare: () => [...ticketConformityMutationKeys.all, "prepare"] as const,
  generateLink: () => [...ticketConformityMutationKeys.all, "generate-link"] as const,
  technicianSignature: () =>
    [...ticketConformityMutationKeys.all, "technician-signature"] as const,
  clientSignature: () =>
    [...ticketConformityMutationKeys.all, "client-signature"] as const,
};

export function prepareTicketConformityMutationOptions(ticketId: number) {
  return mutationOptions({
    mutationKey: ticketConformityMutationKeys.prepare(),
    mutationFn: () => prepareTicketConformity(ticketId),
  });
}

export function generateTicketConformityLinkMutationOptions() {
  return mutationOptions({
    mutationKey: ticketConformityMutationKeys.generateLink(),
    mutationFn: ({ conformityId, input }: GenerateTicketConformityLinkVariables) =>
      generateTicketConformityLink(conformityId, input),
  });
}

export function registerTechnicianSignatureMutationOptions() {
  return mutationOptions({
    mutationKey: ticketConformityMutationKeys.technicianSignature(),
    mutationFn: (input: RegisterTechnicianSignatureInput) =>
      registerTechnicianTicketSignature(input),
  });
}

export function registerClientSignatureMutationOptions() {
  return mutationOptions({
    mutationKey: ticketConformityMutationKeys.clientSignature(),
    mutationFn: (input: RegisterClientSignatureInput) =>
      registerClientTicketSignature(input),
  });
}
