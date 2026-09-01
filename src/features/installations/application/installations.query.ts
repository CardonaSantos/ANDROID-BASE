import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  getAssignedInstallations,
  getInstallationTechnicalDetail,
} from "../api/installations.api";

import type { AssignedInstallationsParams } from "../api/installations.contracts.api";

/*
 * =========================================================
 * FILTROS DE BANDEJA
 * =========================================================
 *
 * La página NO pertenece a los filtros externos de la
 * infinite query.
 *
 * pageParam es responsabilidad de TanStack Query.
 * =========================================================
 */

export type AssignedInstallationsFilters = Omit<
  AssignedInstallationsParams,
  "page"
>;

const DEFAULT_ASSIGNED_INSTALLATIONS_LIMIT = 10;

/*
 * =========================================================
 * NORMALIZACIÓN DE FILTROS
 * =========================================================
 *
 * Queremos que:
 *
 * search: "  Juan  "
 *
 * y:
 *
 * search: "Juan"
 *
 * produzcan exactamente la misma consulta y query key.
 *
 * También evitamos incluir strings vacíos como filtros.
 * =========================================================
 */

function normalizeAssignedInstallationsFilters(
  filters: AssignedInstallationsFilters,
) {
  const search = filters.search?.trim();

  return {
    limit: filters.limit ?? DEFAULT_ASSIGNED_INSTALLATIONS_LIMIT,

    search: search && search.length > 0 ? search : undefined,

    estado: filters.estado,

    fechaProgramadaDesde: filters.fechaProgramadaDesde,

    fechaProgramadaHasta: filters.fechaProgramadaHasta,
  };
}

/*
 * =========================================================
 * QUERY KEYS
 * =========================================================
 *
 * installations
 * │
 * ├── assigned
 * │   └── { filters }
 * │
 * └── detail
 *     └── :installationId
 *
 * La jerarquía nos permitirá posteriormente invalidar:
 *
 * - toda la feature;
 * - toda la bandeja;
 * - una variante filtrada;
 * - todos los detalles;
 * - un detalle específico.
 *
 * No incluimos technicianId:
 * la identidad se obtiene desde el JWT en servidor.
 * =========================================================
 */

export const installationsQueryKeys = {
  all: ["installations"] as const,

  assigned: () => [...installationsQueryKeys.all, "assigned"] as const,

  assignedList: (filters: AssignedInstallationsFilters = {}) =>
    [
      ...installationsQueryKeys.assigned(),
      normalizeAssignedInstallationsFilters(filters),
    ] as const,

  details: () => [...installationsQueryKeys.all, "detail"] as const,

  detail: (installationId: number) =>
    [...installationsQueryKeys.details(), installationId] as const,
};

/*
 * =========================================================
 * MIS INSTALACIONES ASIGNADAS
 * =========================================================
 *
 * GET cliente-instalaciones/mis-asignadas
 *
 * Infinite Query:
 *
 * page 1
 *   ↓
 * page 2
 *   ↓
 * page 3
 *
 * getNextPageParam se guía exclusivamente por la metadata
 * entregada por el backend.
 * =========================================================
 */

export function assignedInstallationsInfiniteQueryOptions(
  filters: AssignedInstallationsFilters = {},
) {
  const normalizedFilters = normalizeAssignedInstallationsFilters(filters);

  return infiniteQueryOptions({
    queryKey: installationsQueryKeys.assignedList(normalizedFilters),

    initialPageParam: 1,

    queryFn: ({ pageParam, signal }) =>
      getAssignedInstallations(
        {
          ...normalizedFilters,

          page: pageParam,
        },
        signal,
      ),

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;

      if (page >= totalPages) {
        return undefined;
      }

      return page + 1;
    },

    /*
     * Información operacional.
     *
     * Queremos refrescar con frecuencia razonable,
     * pero no rehacer requests por cada render.
     */
    staleTime: 30_000,

    refetchOnMount: "always",

    refetchOnReconnect: "always",

    retry: 1,
  });
}

/*
 * =========================================================
 * DETALLE TÉCNICO
 * =========================================================
 *
 * GET cliente-instalaciones/:id/tecnica
 *
 * Aquí sí usamos una query normal:
 * solo existe un detalle por instalación.
 * =========================================================
 */

export function installationTechnicalDetailQueryOptions(
  installationId: number,
) {
  return queryOptions({
    queryKey: installationsQueryKeys.detail(installationId),

    queryFn: ({ signal }) =>
      getInstallationTechnicalDetail(installationId, signal),

    /*
     * No hacemos requests con un id todavía
     * inexistente o inválido.
     */
    enabled: Number.isInteger(installationId) && installationId > 0,

    staleTime: 30_000,

    refetchOnMount: "always",

    refetchOnReconnect: "always",

    retry: 1,
  });
}
