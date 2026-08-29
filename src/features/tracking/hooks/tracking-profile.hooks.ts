import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/core/query";

import {
  changeTrackingProfile,
  getSelectedTrackingProfile,
} from "../application";

import type { TrackingProfileId } from "../background";

export const trackingProfileQueryKey = ["tracking", "profile"] as const;

export function useTrackingProfileQuery() {
  return useQuery({
    queryKey: trackingProfileQueryKey,

    queryFn: getSelectedTrackingProfile,

    staleTime: Infinity,
  });
}

export function useChangeTrackingProfileMutation() {
  return useMutation({
    mutationKey: ["tracking", "profile", "change"],

    mutationFn: (profileId: TrackingProfileId) =>
      changeTrackingProfile(profileId),

    onSuccess: (result) => {
      queryClient.setQueryData(trackingProfileQueryKey, result.profileId);

      void queryClient.invalidateQueries({
        queryKey: ["tracking", "device-status"],
      });
    },
  });
}
