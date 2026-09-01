import { useCallback, useEffect, useMemo, useRef } from "react";

import { StyleSheet, View } from "react-native";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type LatLng,
} from "react-native-maps";

import { AppAlert, AppStack, AppText } from "@/design-system";

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

function getCoordinate(
  technician: MappableTechnicianTrackingRealtimeView,
): LatLng {
  return {
    latitude: technician.ubicacion.latitud,

    longitude: technician.ubicacion.longitud,
  };
}

function getMarkerDescription(
  technician: MappableTechnicianTrackingRealtimeView,
): string {
  const parts: string[] = [];

  if (technician.ubicacion.bateria !== null) {
    parts.push(`Batería ${Math.round(technician.ubicacion.bateria)}%`);
  }

  const ticketCount = technician.actividad.ticketsEnProceso.length;

  if (ticketCount > 0) {
    parts.push(
      ticketCount === 1
        ? "1 ticket en proceso"
        : `${ticketCount} tickets en proceso`,
    );
  }

  if (parts.length === 0) {
    return "Tracking activo";
  }

  return parts.join(" · ");
}

/*
 * =========================================================
 * MAP
 * =========================================================
 */

export function TechnicianRealtimeMap({
  technicians,

  height = 420,

  onTechnicianPress,
}: TechnicianRealtimeMapProps) {
  const mapRef = useRef<MapView | null>(null);

  const mapReadyRef = useRef(false);

  /*
   * Solo queremos volver a ajustar la cámara cuando cambia
   * el conjunto de técnicos visibles.
   *
   * Una actualización GPS normal del mismo técnico NO debe
   * estar recentrando el mapa cada pocos segundos/minutos.
   */
  const technicianSetKey = useMemo(
    () =>
      technicians
        .map((technician) => technician.tecnico.id)
        .sort((left, right) => left - right)
        .join(":"),
    [technicians],
  );

  const coordinates = useMemo(
    () => technicians.map(getCoordinate),
    [technicians],
  );

  const fitTechnicians = useCallback(() => {
    if (!mapReadyRef.current || coordinates.length === 0) {
      return;
    }

    if (coordinates.length === 1) {
      const coordinate = coordinates[0];

      mapRef.current?.animateCamera(
        {
          center: coordinate,

          zoom: 16,
        },
        {
          duration: 350,
        },
      );

      return;
    }

    mapRef.current?.fitToCoordinates(coordinates, {
      animated: true,

      edgePadding: {
        top: 70,

        right: 70,

        bottom: 70,

        left: 70,
      },
    });
  }, [coordinates]);

  /*
   * Si aparece o desaparece un técnico,
   * reajustamos el viewport.
   */
  useEffect(() => {
    fitTechnicians();
  }, [technicianSetKey, fitTechnicians]);

  /*
   * No inventamos una posición inicial.
   *
   * Si todavía ningún técnico ha enviado GPS,
   * mostramos estado vacío.
   */
  if (technicians.length === 0) {
    return (
      <View style={{ minHeight: height }}>
        <AppStack gap="md">
          <AppAlert tone="neutral" title="Sin ubicaciones disponibles">
            Hay técnicos con tracking activo, pero todavía no existe una
            ubicación GPS disponible para mostrar en el mapa.
          </AppAlert>
        </AppStack>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,

        {
          height,
        },
      ]}
    >
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        loadingEnabled
        moveOnMarkerPress={false}
        showsCompass
        showsBuildings
        showsTraffic={false}
        toolbarEnabled={false}
        onMapReady={() => {
          mapReadyRef.current = true;

          fitTechnicians();
        }}
      >
        {technicians.map((technician) => (
          <Marker
            key={`${technician.tecnico.id}:${technician.tracking.sesionId}`}
            identifier={`technician-${technician.tecnico.id}`}
            coordinate={getCoordinate(technician)}
            title={technician.tecnico.nombre}
            description={getMarkerDescription(technician)}
            onPress={() => {
              onTechnicianPress?.(technician);
            }}
          />
        ))}
      </MapView>

      <View style={styles.counter}>
        <AppText variant="labelMedium" weight="semibold">
          {technicians.length === 1
            ? "1 técnico"
            : `${technicians.length} técnicos`}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",

    overflow: "hidden",

    borderRadius: 16,

    position: "relative",
  },

  map: {
    width: "100%",

    height: "100%",
  },

  counter: {
    position: "absolute",

    top: 12,

    right: 12,

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.92)",
  },
});
