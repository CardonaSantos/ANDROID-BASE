import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/core/query";

import {
  activateTrackingDevice,
  getTrackingDeviceStatus,
  grantTrackingBackgroundPermission,
  grantTrackingForegroundPermission,
} from "../application";

import type { TrackingProfileId } from "../background";

export const trackingDeviceStatusQueryKey = [
  "tracking",
  "device-status",
] as const;

async function refreshTrackingDeviceStatus() {
  await queryClient.invalidateQueries({
    queryKey: trackingDeviceStatusQueryKey,
  });
}

export function useTrackingDeviceStatusQuery() {
  return useQuery({
    queryKey: trackingDeviceStatusQueryKey,

    queryFn: getTrackingDeviceStatus,
  });
}

export function useGrantTrackingForegroundPermissionMutation() {
  return useMutation({
    mutationKey: ["tracking", "permission", "foreground"],

    mutationFn: grantTrackingForegroundPermission,

    onSettled: refreshTrackingDeviceStatus,
  });
}

export function useGrantTrackingBackgroundPermissionMutation() {
  return useMutation({
    mutationKey: ["tracking", "permission", "background"],

    mutationFn: grantTrackingBackgroundPermission,

    onSettled: refreshTrackingDeviceStatus,
  });
}

export function useActivateTrackingDeviceMutation() {
  return useMutation({
    mutationKey: ["tracking", "device", "activate"],

    mutationFn: (profileId: TrackingProfileId) =>
      activateTrackingDevice(profileId),

    onSettled: refreshTrackingDeviceStatus,
  });
}
