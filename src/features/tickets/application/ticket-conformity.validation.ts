import { z } from "zod";

export const ticketClientSignatureIdentitySchema = z.object({
  nombreFirmante: z
    .string()
    .trim()
    .min(2, "Ingrese el nombre completo")
    .max(150, "El nombre es demasiado largo"),

  telefonoFirmante: z
    .string()
    .trim()
    .min(6, "Ingrese un teléfono válido")
    .max(30, "El teléfono es demasiado largo")
    .regex(/^[0-9+\s()\-]+$/, "El teléfono contiene caracteres no válidos"),
});

export type TicketClientSignatureIdentity = z.infer<
  typeof ticketClientSignatureIdentitySchema
>;
