import { AppAlert, AppCard, AppStack, AppText } from "@/design-system";

import type { MappableTechnicianTrackingRealtimeView } from "../application/real-time-location.map-selector";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface TechnicianRealtimeMapProps {
  technicians: readonly MappableTechnicianTrackingRealtimeView[];

  height?: number;

  onTechnicianPress?: (
    technician: MappableTechnicianTrackingRealtimeView,
  ) => void;
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "short",

    timeStyle: "medium",
  }).format(date);
}

/*
 * =========================================================
 * WEB FALLBACK
 * =========================================================
 *
 * react-native-maps es nativo.
 *
 * En web dejamos una representación operacional útil
 * para poder desarrollar y comprobar los datos realtime
 * sin intentar cargar módulos nativos.
 * =========================================================
 */

export function TechnicianRealtimeMap({
  technicians,

  onTechnicianPress,
}: TechnicianRealtimeMapProps) {
  if (technicians.length === 0) {
    return (
      <AppAlert tone="neutral" title="Sin ubicaciones disponibles">
        Ningún técnico activo posee todavía una ubicación GPS disponible.
      </AppAlert>
    );
  }

  return (
    <AppStack gap="lg">
      <AppAlert tone="info" title="Mapa disponible en Android">
        En web se muestra la información realtime de los técnicos sin cargar el
        mapa nativo.
      </AppAlert>

      {technicians.map((technician) => {
        const location = technician.ubicacion;

        const ticketCount = technician.actividad.ticketsEnProceso.length;

        return (
          <AppCard
            key={`${technician.tecnico.id}:${technician.tracking.sesionId}`}
            onPress={
              onTechnicianPress
                ? () => {
                    onTechnicianPress(technician);
                  }
                : undefined
            }
          >
            <AppStack gap="md">
              <AppStack gap="xs">
                <AppText variant="titleMedium" weight="semibold">
                  {technician.tecnico.nombre}
                </AppText>

                <AppText tone="muted">
                  Tracking {technician.tracking.estado}
                </AppText>
              </AppStack>

              <AppStack gap="xs">
                <AppText variant="labelMedium" tone="muted">
                  Coordenadas
                </AppText>

                <AppText>
                  {formatCoordinate(location.latitud)},{" "}
                  {formatCoordinate(location.longitud)}
                </AppText>
              </AppStack>

              <AppStack gap="xs">
                <AppText variant="labelMedium" tone="muted">
                  Última actualización
                </AppText>

                <AppText>{formatUpdatedAt(location.recibidoEn)}</AppText>
              </AppStack>

              <AppStack gap="xs">
                <AppText variant="labelMedium" tone="muted">
                  Batería
                </AppText>

                <AppText>
                  {location.bateria === null
                    ? "No disponible"
                    : `${Math.round(location.bateria)}%`}
                </AppText>
              </AppStack>

              <AppStack gap="xs">
                <AppText variant="labelMedium" tone="muted">
                  Actividad
                </AppText>

                <AppText>
                  {ticketCount === 0
                    ? "Sin tickets en proceso"
                    : ticketCount === 1
                      ? "1 ticket en proceso"
                      : `${ticketCount} tickets en proceso`}
                </AppText>
              </AppStack>
            </AppStack>
          </AppCard>
        );
      })}
    </AppStack>
  );
}
