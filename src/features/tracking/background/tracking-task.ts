import * as Location from "expo-location";

import * as TaskManager from "expo-task-manager";

import { Platform } from "react-native";

import { processTrackingLocations } from "./tracking-location-processor";

import { TRACKING_LOCATION_TASK_NAME } from "./tracking-task.constants";

interface TrackingLocationTaskData {
  locations: Location.LocationObject[];
}

if (
  Platform.OS !== "web" &&
  !TaskManager.isTaskDefined(TRACKING_LOCATION_TASK_NAME)
) {
  TaskManager.defineTask<TrackingLocationTaskData>(
    TRACKING_LOCATION_TASK_NAME,

    async ({ data, error }) => {
      if (error) {
        console.error("[tracking-task] Error:", error.message);

        return;
      }

      const locations = data?.locations ?? [];

      if (locations.length === 0) {
        return;
      }

      try {
        const result = await processTrackingLocations(locations);

        console.info("[tracking-task] Procesamiento completado:", {
          active: result.active,

          received: locations.length,

          accepted: result.accepted,

          ignored: result.ignored,

          sent: result.flush?.sent ?? 0,

          pending: result.flush?.remaining ?? 0,
        });
      } catch (cause) {
        /*
         * Nunca dejamos escapar un error
         * no controlado desde la definición
         * de TaskManager.
         */
        console.error("[tracking-task] No se pudo procesar el lote.", cause);
      }
    },
  );
}
