import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/core/query";

import {
  activateTrackingDevice,
  getTrackingDeviceStatus,
  grantTrackingBackgroundPermission,
  grantTrackingForegroundPermission,
  reconcileTrackingRuntime,
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

async function reconcileAfterPermission(granted: boolean): Promise<void> {
  await refreshTrackingDeviceStatus();

  if (!granted) {
    return;
  }

  try {
    await reconcileTrackingRuntime();
  } catch {
    /*
     * Puede no existir jornada todavía.
     * Conceder permisos sigue siendo una
     * operación válida por sí misma.
     */
  }

  await refreshTrackingDeviceStatus();
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

    onSuccess: reconcileAfterPermission,

    onError: refreshTrackingDeviceStatus,
  });
}

export function useGrantTrackingBackgroundPermissionMutation() {
  return useMutation({
    mutationKey: ["tracking", "permission", "background"],

    mutationFn: grantTrackingBackgroundPermission,

    onSuccess: reconcileAfterPermission,

    onError: refreshTrackingDeviceStatus,
  });
}

/*
 * Se conserva temporalmente para
 * compatibilidad/tests.
 *
 * La UI final ya no debe mostrar
 * un botón manual de activación.
 */
export function useActivateTrackingDeviceMutation() {
  return useMutation({
    mutationKey: ["tracking", "device", "activate"],

    mutationFn: (profileId: TrackingProfileId) =>
      activateTrackingDevice(profileId),

    onSettled: refreshTrackingDeviceStatus,
  });
}
