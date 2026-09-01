import { useCallback, useRef, useState } from "react";

import {
  revealInstallationPppoeCredentials,
  type RevealInstallationPppoeCredentialsResponse,
} from "../api/installation-credentials.api";

/*
 * =========================================================
 * MUTATION CONTRACT
 * =========================================================
 *
 * Presentamos una interfaz familiar:
 *
 * mutation.mutateAsync(id)
 * mutation.isPending
 *
 * pero deliberadamente NO utilizamos TanStack MutationCache.
 * =========================================================
 */

export interface RevealInstallationPppoeCredentialsMutation {
  isPending: boolean;

  mutateAsync: (
    installationId: number,
  ) => Promise<RevealInstallationPppoeCredentialsResponse>;
}

/*
 * =========================================================
 * REVEAL CREDENTIALS
 * =========================================================
 *
 * SECURITY:
 *
 * Este hook NO mantiene:
 *
 * - data;
 * - error;
 * - contraseña;
 * - respuesta previa.
 *
 * Solo mantiene `isPending`.
 *
 * El resultado se devuelve directamente al caller.
 * =========================================================
 */

export function useRevealInstallationPppoeCredentialsMutation(): RevealInstallationPppoeCredentialsMutation {
  const [isPending, setIsPending] = useState(false);

  /*
   * Evita doble submit aunque dos eventos ocurran
   * antes de que React procese setIsPending(true).
   */
  const inFlightRef = useRef(false);

  const mutateAsync = useCallback(
    async (
      installationId: number,
    ): Promise<RevealInstallationPppoeCredentialsResponse> => {
      /*
       * Una revelación ya está activa.
       *
       * No ejecutamos una segunda solicitud paralela.
       */
      if (inFlightRef.current) {
        throw new Error("Ya hay una consulta de credenciales PPPoE en curso.");
      }

      inFlightRef.current = true;

      setIsPending(true);

      try {
        /*
         * El resultado solamente existe:
         *
         * API
         *   ↓
         * stack local de esta Promise
         *   ↓
         * caller
         *
         * No pasa por QueryCache ni MutationCache.
         */
        return await revealInstallationPppoeCredentials(installationId);
      } finally {
        inFlightRef.current = false;

        setIsPending(false);
      }
    },
    [],
  );

  return {
    isPending,

    mutateAsync,
  };
}
