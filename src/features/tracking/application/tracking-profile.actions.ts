import {
  isTrackingLocationServiceRunning,
  reconfigureTrackingLocationService,
  type TrackingProfileId,
} from "../background";

import { loadTrackingProfileId, saveTrackingProfileId } from "../storage";

export interface ChangeTrackingProfileResult {
  profileId: TrackingProfileId;

  serviceReconfigured: boolean;
}

export async function getSelectedTrackingProfile(): Promise<TrackingProfileId> {
  return loadTrackingProfileId();
}

export async function changeTrackingProfile(
  profileId: TrackingProfileId,
): Promise<ChangeTrackingProfileResult> {
  const previousProfile = await loadTrackingProfileId();

  if (previousProfile === profileId) {
    return {
      profileId,

      serviceReconfigured: false,
    };
  }

  const serviceRunning = await isTrackingLocationServiceRunning();

  /*
   * Si todavía no existe servicio activo,
   * simplemente guardamos la preferencia.
   *
   * Se utilizará al iniciar la próxima jornada.
   */
  if (!serviceRunning) {
    await saveTrackingProfileId(profileId);

    return {
      profileId,

      serviceReconfigured: false,
    };
  }

  /*
   * Hay una jornada ejecutando ubicación.
   * Reconfiguramos únicamente el servicio
   * local; la sesión del backend no cambia.
   */
  const result = await reconfigureTrackingLocationService(profileId);

  if (!result.started) {
    /*
     * Intentamos recuperar la configuración
     * anterior para no dejar el servicio
     * detenido por un cambio de perfil.
     */
    try {
      await reconfigureTrackingLocationService(previousProfile);
    } catch {
      // La reconciliación posterior
      // volverá a intentar recuperar
      // el servicio.
    }

    throw new Error(
      `No fue posible aplicar el perfil de tracking: ${result.reason}.`,
    );
  }

  await saveTrackingProfileId(profileId);

  return {
    profileId,

    serviceReconfigured: true,
  };
}
