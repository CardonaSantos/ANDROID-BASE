import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import {
  getAssignedInstallations,
  getInstallationTechnicalDetail,
} from "../api/installations.api";

import type { AssignedInstallationsParams } from "../api/installations.contracts.api";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type AssignedInstallationsFilters = Omit<
  AssignedInstallationsParams,
  "page" | "limit"
>;

export interface AssignedInstallationsPageParams extends AssignedInstallationsFilters {
  page: number;

  limit: number;
}

/*
 * =========================================================
 * QUERY KEYS
 * =========================================================
 */

export const installationsQueryKeys = {
  all: ["installations"] as const,

  /*
   * Raíz de cualquier consulta relacionada con la
   * bandeja de instalaciones asignadas.
   *
   * También sirve para invalidar TODAS sus páginas:
   *
   * queryClient.invalidateQueries({
   *   queryKey: installationsQueryKeys.assigned(),
   * })
   */
  assigned: () => [...installationsQueryKeys.all, "assigned"] as const,

  /*
   * Página específica.
   *
   * Los filtros forman parte de la query key.
   */
  assignedPage: (params: AssignedInstallationsPageParams) =>
    [...installationsQueryKeys.assigned(), "page", params] as const,

  detail: (installationId: number) =>
    [...installationsQueryKeys.all, "detail", installationId] as const,
};

/*
 * =========================================================
 * ASSIGNED INSTALLATIONS
 * =========================================================
 *
 * GET /cliente-instalaciones/mis-asignadas
 *
 * Paginación explícita controlada por la pantalla.
 * =========================================================
 */

export function assignedInstallationsQueryOptions(
  params: AssignedInstallationsPageParams,
) {
  return queryOptions({
    queryKey: installationsQueryKeys.assignedPage(params),

    queryFn: ({ signal }) =>
      getAssignedInstallations(
        {
          ...params,
        },

        signal,
      ),

    /*
     * Al navegar:
     *
     * página 1
     *    ↓
     * página 2
     *
     * mantenemos los datos anteriores mientras llega
     * la respuesta nueva.
     *
     * La pantalla usa isPlaceholderData para indicar
     * que se está realizando el cambio.
     */
    placeholderData: keepPreviousData,
  });
}

/*
 * =========================================================
 * TECHNICAL DETAIL
 * =========================================================
 */

export function installationTechnicalDetailQueryOptions(
  installationId: number,
) {
  return queryOptions({
    queryKey: installationsQueryKeys.detail(installationId),

    queryFn: ({ signal }) =>
      getInstallationTechnicalDetail(
        installationId,

        signal,
      ),

    enabled: Number.isInteger(installationId) && installationId > 0,
  });
}
