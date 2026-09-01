import { useMemo, useState } from "react";

import { MapPin, RefreshCw } from "lucide-react-native";

import { isAppError } from "@/core/errors";

import {
  AppAlert,
  AppButton,
  AppCard,
  AppIcon,
  AppScrollScreen,
  AppStack,
  AppText,
} from "@/design-system";

import {
  selectMappableRealtimeTechnicians,
  type MappableTechnicianTrackingRealtimeView,
} from "../application/real-time-location.map-selector";

import { useTechnicianTrackingRealtimeQuery } from "../application/real-time-location.query";
import { RealtimeConnectionCard } from "./RealtimeConnectionCard";
import { TechnicianRealtimeMap } from "./TechnicianRealtimeMap";
/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getErrorMessage(error: unknown): string {
  if (!isAppError(error)) {
    return "No fue posible cargar las ubicaciones de los técnicos.";
  }

  switch (error.kind) {
    case "network":
      return "No se pudo conectar con el servidor.";

    case "timeout":
      return "El servidor tardó demasiado en responder.";

    case "unauthorized":
      return "La sesión ya no es válida.";

    case "forbidden":
      return "No tienes autorización para consultar estas ubicaciones.";

    default:
      return "No fue posible cargar las ubicaciones de los técnicos.";
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",

    timeStyle: "short",
  }).format(date);
}

/*
 * =========================================================
 * SELECTED TECHNICIAN
 * =========================================================
 */

interface SelectedTechnicianCardProps {
  technician: MappableTechnicianTrackingRealtimeView;
}

function SelectedTechnicianCard({ technician }: SelectedTechnicianCardProps) {
  const location = technician.ubicacion;

  const tickets = technician.actividad.ticketsEnProceso;

  return (
    <AppCard>
      <AppStack gap="lg">
        <AppStack gap="xs">
          <AppIcon icon={MapPin} size="lg" tone="primary" decorative />

          <AppText variant="titleMedium" weight="semibold">
            {technician.tecnico.nombre}
          </AppText>

          <AppText tone="muted">
            {technician.tecnico.telefono ?? "Sin teléfono registrado"}
          </AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="labelMedium" tone="muted">
            Estado
          </AppText>

          <AppText>{technician.tracking.estado}</AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="labelMedium" tone="muted">
            Última ubicación
          </AppText>

          <AppText>
            {location.latitud.toFixed(6)}, {location.longitud.toFixed(6)}
          </AppText>

          <AppText tone="muted">{formatDate(location.recibidoEn)}</AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="labelMedium" tone="muted">
            Precisión
          </AppText>

          <AppText>
            {location.precision === null
              ? "No disponible"
              : `${Math.round(location.precision)} m`}
          </AppText>
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

          {tickets.length === 0 ? (
            <AppText>Sin tickets en proceso</AppText>
          ) : (
            <AppStack gap="sm">
              {tickets.map((ticket) => (
                <AppStack key={ticket.id} gap="xs">
                  <AppText weight="semibold">
                    {ticket.titulo ?? `Ticket #${ticket.id}`}
                  </AppText>

                  <AppText tone="muted">
                    {ticket.estado} · {ticket.prioridad}
                  </AppText>
                </AppStack>
              ))}
            </AppStack>
          )}
        </AppStack>
      </AppStack>
    </AppCard>
  );
}

/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export function RealTimeLocationScreen() {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<
    number | null
  >(null);

  const trackingQuery = useTechnicianTrackingRealtimeQuery();

  /*
   * Cache completa:
   *
   * - incluye técnicos ACTIVA sin GPS todavía;
   * - Socket.IO continúa escribiendo sobre ella.
   */
  const realtimeTechnicians = trackingQuery.data ?? [];

  /*
   * Vista específica para mapa:
   *
   * - ACTIVA;
   * - ubicacion !== null.
   */
  const mappableTechnicians = useMemo(
    () => selectMappableRealtimeTechnicians(realtimeTechnicians),
    [realtimeTechnicians],
  );

  /*
   * Guardamos únicamente el ID.
   *
   * Así, cuando Socket.IO actualiza coordenadas,
   * el detalle seleccionado también obtiene la
   * representación nueva automáticamente.
   */
  const selectedTechnician = useMemo(
    () =>
      selectedTechnicianId === null
        ? null
        : (mappableTechnicians.find(
            (technician) => technician.tecnico.id === selectedTechnicianId,
          ) ?? null),
    [mappableTechnicians, selectedTechnicianId],
  );

  /*
   * =======================================================
   * LOADING
   * =======================================================
   */

  if (trackingQuery.isPending) {
    return (
      <AppScrollScreen>
        <AppStack gap="lg">
          <AppStack gap="xs">
            <AppText variant="headlineSmall" weight="semibold">
              Ubicación de técnicos
            </AppText>

            <AppText tone="muted">Consultando técnicos activos...</AppText>
          </AppStack>
        </AppStack>
      </AppScrollScreen>
    );
  }

  /*
   * =======================================================
   * ERROR
   * =======================================================
   */

  if (trackingQuery.isError) {
    return (
      <AppScrollScreen>
        <AppStack gap="lg">
          <AppStack gap="xs">
            <AppText variant="headlineSmall" weight="semibold">
              Ubicación de técnicos
            </AppText>

            <AppText tone="muted">
              Seguimiento operacional en tiempo real.
            </AppText>
          </AppStack>

          <AppAlert tone="danger" title="No se pudieron cargar las ubicaciones">
            {getErrorMessage(trackingQuery.error)}
          </AppAlert>

          <AppButton
            variant="outlined"
            leadingIcon={RefreshCw}
            onPress={() => {
              void trackingQuery.refetch();
            }}
          >
            Reintentar
          </AppButton>
        </AppStack>
      </AppScrollScreen>
    );
  }

  /*
   * =======================================================
   * CONTENT
   * =======================================================
   */

  return (
    <AppScrollScreen>
      <AppStack gap="2xl">
        {/* HEADER */}

        <AppStack gap="xs">
          <AppText variant="headlineSmall" weight="semibold">
            Ubicación de técnicos
          </AppText>

          <AppText tone="muted">
            Seguimiento de jornadas y posiciones disponibles.
          </AppText>
        </AppStack>

        {/* REALTIME CONNECTION */}

        <RealtimeConnectionCard />

        {/* STATUS */}

        <AppCard>
          <AppStack gap="lg">
            <AppStack gap="xs">
              <AppText variant="labelMedium" tone="muted">
                Técnicos con jornada activa
              </AppText>

              <AppText variant="headlineSmall" weight="semibold">
                {realtimeTechnicians.length}
              </AppText>
            </AppStack>

            <AppStack gap="xs">
              <AppText variant="labelMedium" tone="muted">
                Con ubicación disponible
              </AppText>

              <AppText variant="headlineSmall" weight="semibold">
                {mappableTechnicians.length}
              </AppText>
            </AppStack>

            <AppButton
              variant="outlined"
              leadingIcon={RefreshCw}
              loading={trackingQuery.isFetching}
              loadingAccessibilityLabel="Actualizando ubicaciones"
              onPress={() => {
                void trackingQuery.refetch();
              }}
            >
              Actualizar
            </AppButton>
          </AppStack>
        </AppCard>

        {/* ACTIVE BUT WITHOUT GPS */}

        {realtimeTechnicians.length > 0 && mappableTechnicians.length === 0 ? (
          <AppAlert tone="info" title="Esperando primera ubicación">
            Existen jornadas activas, pero ningún técnico ha enviado todavía una
            posición GPS disponible para el mapa.
          </AppAlert>
        ) : null}

        {/* MAP */}

        <TechnicianRealtimeMap
          technicians={mappableTechnicians}
          onTechnicianPress={(technician) => {
            setSelectedTechnicianId(technician.tecnico.id);
          }}
        />

        {/* SELECTED TECHNICIAN */}

        {selectedTechnician ? (
          <SelectedTechnicianCard technician={selectedTechnician} />
        ) : mappableTechnicians.length > 0 ? (
          <AppAlert tone="neutral" title="Selecciona un técnico">
            Toca un marcador para consultar su ubicación, batería y actividad
            actual.
          </AppAlert>
        ) : null}
      </AppStack>
    </AppScrollScreen>
  );
}
