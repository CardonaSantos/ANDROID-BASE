import { useQuery } from "@tanstack/react-query";

import {
  assignedInstallationsQueryOptions,
  installationTechnicalDetailQueryOptions,
  type AssignedInstallationsPageParams,
} from "../application/installations.query";

/*
 * =========================================================
 * ASSIGNED INSTALLATIONS
 * =========================================================
 */

export function useAssignedInstallationsQuery(
  params: AssignedInstallationsPageParams,
) {
  return useQuery(assignedInstallationsQueryOptions(params));
}

/*
 * =========================================================
 * TECHNICAL DETAIL
 * =========================================================
 */

export function useInstallationTechnicalDetailQuery(installationId: number) {
  return useQuery(installationTechnicalDetailQueryOptions(installationId));
}
