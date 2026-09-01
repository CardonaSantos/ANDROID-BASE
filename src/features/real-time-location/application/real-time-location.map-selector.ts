import type {
  RealtimeTechnicianLocation,
  TechnicianTrackingRealtimeList,
  TechnicianTrackingRealtimeView,
} from "../api/real-time-location.contracts.api";

/*
 * =========================================================
 * MAP TECHNICIAN VIEW
 * =========================================================
 *
 * Para aparecer físicamente sobre un mapa necesitamos
 * una garantía adicional:
 *
 * ubicacion !== null
 *
 * El snapshot puede contener una sesión ACTIVA que todavía
 * no ha enviado su primer punto GPS.
 * =========================================================
 */

export type MappableTechnicianTrackingRealtimeView =
  TechnicianTrackingRealtimeView & {
    ubicacion: RealtimeTechnicianLocation;
  };

/*
 * =========================================================
 * TYPE GUARD
 * =========================================================
 */

function isMappableTechnician(
  technician: TechnicianTrackingRealtimeView,
): technician is MappableTechnicianTrackingRealtimeView {
  /*
   * El snapshot HTTP debería contener únicamente sesiones
   * activas, pero mantenemos esta condición en el borde
   * visual para no dibujar estados obsoletos accidentalmente.
   */
  return (
    technician.tracking.estado === "ACTIVA" && technician.ubicacion !== null
  );
}

/*
 * =========================================================
 * MAP SELECTOR
 * =========================================================
 *
 * La cache conserva también técnicos ACTIVA que aún
 * no poseen ubicación.
 *
 * El mapa, en cambio, recibe exclusivamente técnicos
 * con coordenadas reales.
 * =========================================================
 */

export function selectMappableRealtimeTechnicians(
  technicians: TechnicianTrackingRealtimeList | undefined,
): MappableTechnicianTrackingRealtimeView[] {
  if (!technicians) {
    return [];
  }

  return technicians.filter(isMappableTechnician);
}
