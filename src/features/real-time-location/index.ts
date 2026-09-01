/*
 * =========================================================
 * REAL TIME LOCATION
 * =========================================================
 *
 * API pública del feature.
 *
 * Las rutas y otros features no deberían depender
 * directamente de la estructura interna:
 *
 * components/
 * application/
 * api/
 * realtime/
 *
 * Si posteriormente reorganizamos el feature,
 * los consumidores externos permanecen estables.
 * =========================================================
 */

export { RealTimeLocationScreen } from "./components/RealTimeLocationScreen";
