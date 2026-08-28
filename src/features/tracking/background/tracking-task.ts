import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import { Platform } from "react-native";

import { TRACKING_LOCATION_TASK_NAME } from "./tracking-task.constants";

interface TrackingLocationTaskData {
  locations: Location.LocationObject[];
}

/**
 * IMPORTANTE:
 *
 * Esta task debe definirse en module scope.
 * Nunca dentro de:
 *
 * - useEffect
 * - TrackingScreen
 * - hooks React
 * - callbacks de botones
 *
 * Android puede cargar el bundle JS
 * específicamente para ejecutar esta
 * función sin montar ninguna pantalla.
 */
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

      /*
       * Por ahora únicamente comprobamos
       * que la task recibe ubicaciones.
       *
       * El siguiente paso reemplazará
       * esto por:
       *
       * location
       *   -> normalización
       *   -> regla tiempo/distancia
       *   -> SQLite
       *   -> HTTP
       */
      console.info("[tracking-task] Ubicaciones recibidas:", locations.length);
    },
  );
}
