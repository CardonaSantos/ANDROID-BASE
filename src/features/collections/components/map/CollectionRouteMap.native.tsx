import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { View } from "react-native";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type LatLng,
  type Region,
} from "react-native-maps";

import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AppAlert, AppText } from "@/design-system";

import type { CollectionClient } from "../../api/collections.contracts.api";

export interface CollectionRouteMapProps {
  clients: readonly CollectionClient[];

  selectedClientId: number | null;

  height?: number;

  onSelectClient: (clientId: number) => void;
}

/*
 * =========================================================
 * COORDINATES
 * =========================================================
 */

function getCoordinate(client: CollectionClient): LatLng {
  if (!client.ubicacion) {
    throw new Error("CollectionRouteMap recibió un cliente sin ubicación.");
  }

  return {
    latitude: client.ubicacion.latitud,

    longitude: client.ubicacion.longitud,
  };
}

/*
 * =========================================================
 * INITIAL REGION
 * =========================================================
 *
 * Evitamos que Google Maps aparezca inicialmente mostrando
 * el mapa mundial.
 *
 * La región inicial se calcula directamente a partir de
 * los clientes de la ruta.
 *
 * Después del montaje, fitToCoordinates hace el ajuste
 * definitivo considerando el tamaño real del componente.
 */

function getInitialRegion(coordinates: readonly LatLng[]): Region | undefined {
  if (coordinates.length === 0) {
    return undefined;
  }

  /*
   * Un único cliente:
   * arrancamos directamente con un zoom local.
   */
  if (coordinates.length === 1) {
    return {
      latitude: coordinates[0].latitude,

      longitude: coordinates[0].longitude,

      latitudeDelta: 0.015,

      longitudeDelta: 0.015,
    };
  }

  let minLatitude = coordinates[0].latitude;
  let maxLatitude = coordinates[0].latitude;

  let minLongitude = coordinates[0].longitude;
  let maxLongitude = coordinates[0].longitude;

  for (const coordinate of coordinates) {
    minLatitude = Math.min(minLatitude, coordinate.latitude);

    maxLatitude = Math.max(maxLatitude, coordinate.latitude);

    minLongitude = Math.min(minLongitude, coordinate.longitude);

    maxLongitude = Math.max(maxLongitude, coordinate.longitude);
  }

  const latitude = (minLatitude + maxLatitude) / 2;

  const longitude = (minLongitude + maxLongitude) / 2;

  /*
   * Dejamos margen alrededor de los puntos.
   *
   * El mínimo evita un zoom excesivo cuando los clientes
   * están prácticamente en la misma zona.
   */
  const latitudeDelta = Math.max((maxLatitude - minLatitude) * 1.35, 0.015);

  const longitudeDelta = Math.max((maxLongitude - minLongitude) * 1.35, 0.015);

  return {
    latitude,

    longitude,

    latitudeDelta,

    longitudeDelta,
  };
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function CollectionRouteMap({
  clients,
  selectedClientId,
  height = 430,
  onSelectClient,
}: CollectionRouteMapProps) {
  const mapRef = useRef<MapView | null>(null);

  /*
   * Evita que un cliente que ya venía seleccionado al
   * montar la pantalla interrumpa el encuadre inicial.
   *
   * Solo los cambios posteriores de selección moverán
   * la cámara.
   */
  const lastFocusedClientIdRef = useRef<number | null>(selectedClientId);

  const [mapReady, setMapReady] = useState(false);

  const [layoutReady, setLayoutReady] = useState(false);

  const [initialFitCompleted, setInitialFitCompleted] = useState(false);

  const { theme } = useUnistyles();

  /*
   * =======================================================
   * DATA
   * =======================================================
   */

  const coordinates = useMemo(() => clients.map(getCoordinate), [clients]);

  const clientSetKey = useMemo(
    () =>
      clients
        .map((client) => client.id)
        .sort((a, b) => a - b)
        .join(":"),
    [clients],
  );

  const initialRegion = useMemo(
    () => getInitialRegion(coordinates),
    [coordinates],
  );

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? null,
    [clients, selectedClientId],
  );

  /*
   * =======================================================
   * FIT ROUTE
   * =======================================================
   */

  const fitClients = useCallback(
    (animated: boolean) => {
      if (!mapReady || !layoutReady || coordinates.length === 0) {
        return;
      }

      /*
       * Una sola ubicación no necesita bounds.
       */
      if (coordinates.length === 1) {
        mapRef.current?.animateCamera(
          {
            center: coordinates[0],

            zoom: 16,
          },
          {
            duration: animated ? 300 : 0,
          },
        );

        return;
      }

      mapRef.current?.fitToCoordinates(coordinates, {
        animated,

        edgePadding: {
          top: 60,

          right: 45,

          bottom: 60,

          left: 45,
        },
      });
    },
    [coordinates, layoutReady, mapReady],
  );

  /*
   * =======================================================
   * RESET WHEN CLIENT SET CHANGES
   * =======================================================
   */

  useEffect(() => {
    setInitialFitCompleted(false);
  }, [clientSetKey]);

  /*
   * =======================================================
   * INITIAL FIT
   * =======================================================
   *
   * Esperamos:
   *
   * 1. Google Map listo.
   * 2. Contenedor con dimensiones reales.
   *
   * requestAnimationFrame da a RN una oportunidad adicional
   * para terminar el layout antes de fitToCoordinates().
   */

  useEffect(() => {
    if (
      !mapReady ||
      !layoutReady ||
      initialFitCompleted ||
      coordinates.length === 0
    ) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      fitClients(false);

      setInitialFitCompleted(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [
    coordinates.length,
    fitClients,
    initialFitCompleted,
    layoutReady,
    mapReady,
  ]);

  /*
   * =======================================================
   * SELECTED CLIENT
   * =======================================================
   *
   * El primer selectedClientId NO mueve la cámara.
   *
   * Eso permite que al entrar en "Mapa" primero se vea toda
   * la ruta y no solamente el primer cliente.
   *
   * Cuando el usuario selecciona otro marker posteriormente,
   * entonces sí hacemos zoom.
   */

  useEffect(() => {
    if (!selectedClient) {
      lastFocusedClientIdRef.current = null;

      return;
    }

    if (!mapReady || !layoutReady || !initialFitCompleted) {
      return;
    }

    if (lastFocusedClientIdRef.current === selectedClient.id) {
      return;
    }

    lastFocusedClientIdRef.current = selectedClient.id;

    mapRef.current?.animateCamera(
      {
        center: getCoordinate(selectedClient),

        zoom: 17,
      },
      {
        duration: 300,
      },
    );
  }, [initialFitCompleted, layoutReady, mapReady, selectedClient]);

  /*
   * =======================================================
   * EMPTY
   * =======================================================
   */

  if (clients.length === 0) {
    return (
      <View
        style={{
          minHeight: height,
        }}
      >
        <AppAlert tone="neutral" title="Sin ubicaciones disponibles">
          Los clientes de esta ruta todavía no tienen coordenadas válidas para
          mostrar en el mapa.
        </AppAlert>
      </View>
    );
  }

  /*
   * =======================================================
   * MAP
   * =======================================================
   */

  return (
    <View
      style={[
        styles.container,
        {
          height,
        },
      ]}
      onLayout={() => {
        setLayoutReady(true);
      }}
    >
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        /*
         * CRÍTICO:
         *
         * El primer render ya nace sobre la zona de los
         * clientes y nunca sobre el mapa mundial.
         */
        initialRegion={initialRegion}
        loadingEnabled
        showsCompass
        showsBuildings
        showsTraffic={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        onMapReady={() => {
          setMapReady(true);
        }}
      >
        {clients.map((client) => {
          const selected = client.id === selectedClientId;

          return (
            <Marker
              key={client.id}
              identifier={`collection-client-${client.id}`}
              coordinate={getCoordinate(client)}
              title={client.nombreCompleto}
              description={
                client.totalDebe > 0
                  ? `Pendiente: Q${client.totalDebe.toFixed(2)}`
                  : "Sin saldo pendiente"
              }
              pinColor={
                selected
                  ? theme.colors.primary
                  : client.totalDebe > 0
                    ? theme.colors.danger
                    : theme.colors.success
              }
              onPress={() => onSelectClient(client.id)}
            />
          );
        })}
      </MapView>

      <View style={styles.counter} pointerEvents="none">
        <AppText variant="labelMedium" weight="semibold">
          {clients.length === 1
            ? "1 ubicación"
            : `${clients.length} ubicaciones`}
        </AppText>
      </View>
    </View>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles = StyleSheet.create((theme) => ({
  container: {
    width: "100%",

    overflow: "hidden",

    borderRadius: theme.radius.lg,

    position: "relative",
  },

  map: {
    width: "100%",

    height: "100%",
  },

  counter: {
    position: "absolute",

    top: theme.spacing.sm,

    right: theme.spacing.sm,

    paddingHorizontal: theme.spacing.md,

    paddingVertical: theme.spacing.sm,

    borderRadius: theme.radius.full,

    backgroundColor: theme.colors.surfaceElevated,
  },
}));
