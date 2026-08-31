import { z } from "zod";

export const loginCredentialsSchema = z.object({
  correo: z.string().trim().email("Ingresa un correo electrónico válido."),

  contrasena: z
    .string()
    .min(4, "La contraseña debe tener al menos 4 caracteres."),
});

export const authUserSchema = z.object({
  id: z.number().int(),

  nombre: z.string().min(1),

  correo: z.string().email(),

  rol: z.string().min(1),

  activo: z.boolean(),

  empresaId: z.number().int(),

  avatarUrl: z.string().url().nullable(),

  portadaUrl: z.string().url().nullable(),
});

export const loginResponseSchema = z.object({
  user: authUserSchema,

  access_token: z.string().min(1),
});

export const profileResponseSchema = authUserSchema;

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

export type AuthUser = z.infer<typeof authUserSchema>;

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export interface AuthSessionPayload {
  user: AuthUser;

  accessToken: string;
}
