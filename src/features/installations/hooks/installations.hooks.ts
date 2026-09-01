import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  assignedInstallationsInfiniteQueryOptions,
  installationTechnicalDetailQueryOptions,
  type AssignedInstallationsFilters,
} from "../application/installations.query";

/*
 * =========================================================
 * MIS INSTALACIONES ASIGNADAS
 * =========================================================
 *
 * El hook permanece deliberadamente delgado.
 *
 * No:
 * - ordena;
 * - aplana páginas;
 * - filtra nuevamente;
 * - transforma datos para UI.
 *
 * Esas responsabilidades pertenecen a la capa que realmente
 * las necesite.
 * =========================================================
 */

export function useAssignedInstallationsInfiniteQuery(
  filters: AssignedInstallationsFilters = {},
) {
  return useInfiniteQuery(assignedInstallationsInfiniteQueryOptions(filters));
}

/*
 * =========================================================
 * DETALLE TÉCNICO
 * =========================================================
 */

export function useInstallationTechnicalDetailQuery(installationId: number) {
  return useQuery(installationTechnicalDetailQueryOptions(installationId));
}
