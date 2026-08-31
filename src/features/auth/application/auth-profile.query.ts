import { queryOptions } from "@tanstack/react-query";

import { loadAuthProfile } from "../api";

export const authProfileQueryKey = ["auth", "profile"] as const;

export function authProfileQueryOptions() {
  return queryOptions({
    queryKey: authProfileQueryKey,

    queryFn: ({ signal }) => loadAuthProfile(signal),

    /*
     * El perfil autenticado representa
     * identidad de sesión.
     *
     * No es información de alta
     * frecuencia, por lo que no debe
     * refetchearse constantemente.
     */
    staleTime: 5 * 60 * 1000,

    /*
     * Recuperar focus no implica que
     * nombre/correo/rol hayan cambiado.
     *
     * Cuando editemos el perfil,
     * invalidaremos esta query
     * explícitamente.
     */
    refetchOnWindowFocus: false,

    retry: 1,
  });
}
