import { useQuery } from "@tanstack/react-query";

import { getTechnicianPanel } from "../api";

export const technicianPanelQueryKey = [
  "dashboard",
  "technician-panel",
] as const;

export function useTechnicianPanelQuery(enabled = true) {
  return useQuery({
    queryKey: technicianPanelQueryKey,

    queryFn: ({ signal }) => getTechnicianPanel(signal),

    enabled,

    staleTime: 30_000,

    retry: 1,
  });
}
