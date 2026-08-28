import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/core/query";

import { getMyTrackingState, startTracking, type TrackingState } from "../api";

export const trackingStateQueryKey = ["tracking", "me"] as const;

export function useTrackingStateQuery() {
  return useQuery({
    queryKey: trackingStateQueryKey,

    queryFn: ({ signal }) => getMyTrackingState(signal),
  });
}

export function useStartTrackingMutation() {
  return useMutation({
    mutationKey: ["tracking", "start"],

    mutationFn: () => startTracking(),

    onSuccess: (result) => {
      const nextState: TrackingState = {
        activo: true,

        sesionTrackingId: result.sesionTrackingId,

        asistenciaId: result.asistenciaId,

        estado: result.estado,

        iniciadoEn: result.iniciadoEn,

        ultimoHeartbeatEn: result.ultimoHeartbeatEn,
      };

      queryClient.setQueryData(trackingStateQueryKey, nextState);
    },
  });
}
