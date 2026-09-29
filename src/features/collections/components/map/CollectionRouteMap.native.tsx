import { useCallback, useEffect, useMemo, useRef } from "react";

import { View } from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE, type LatLng } from "react-native-maps";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AppAlert, AppText } from "@/design-system";

import type { CollectionClient } from "../../api/collections.contracts.api";

export interface CollectionRouteMapProps {
  clients: readonly CollectionClient[];
  selectedClientId: number | null;
  height?: number;
  onSelectClient: (clientId: number) => void;
}

function getCoordinate(client: CollectionClient): LatLng {
  if (!client.ubicacion) {
    throw new Error("CollectionRouteMap recibió un cliente sin ubicación.");
  }

  return {
    latitude: client.ubicacion.latitud,
    longitude: client.ubicacion.longitud,
  };
}

export function CollectionRouteMap({
  clients,
  selectedClientId,
  height = 430,
  onSelectClient,
}: CollectionRouteMapProps) {
  const mapRef = useRef<MapView | null>(null);
  const mapReadyRef = useRef(false);
  const { theme } = useUnistyles();

  const coordinates = useMemo(() => clients.map(getCoordinate), [clients]);
  const clientSetKey = useMemo(
    () => clients.map((client) => client.id).sort((a, b) => a - b).join(":"),
    [clients],
  );

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? null,
    [clients, selectedClientId],
  );

  const fitClients = useCallback(() => {
    if (!mapReadyRef.current || coordinates.length === 0) {
      return;
    }

    if (coordinates.length === 1) {
      mapRef.current?.animateCamera(
        { center: coordinates[0], zoom: 16 },
        { duration: 350 },
      );
      return;
    }

    mapRef.current?.fitToCoordinates(coordinates, {
      animated: true,
      edgePadding: { top: 70, right: 50, bottom: 70, left: 50 },
    });
  }, [coordinates]);

  useEffect(() => {
    fitClients();
  }, [clientSetKey, fitClients]);

  useEffect(() => {
    if (!mapReadyRef.current || !selectedClient) {
      return;
    }

    mapRef.current?.animateCamera(
      { center: getCoordinate(selectedClient), zoom: 17 },
      { duration: 300 },
    );
  }, [selectedClient]);

  if (clients.length === 0) {
    return (
      <View style={{ minHeight: height }}>
        <AppAlert tone="neutral" title="Sin ubicaciones disponibles">
          Los clientes de esta ruta todavía no tienen coordenadas válidas para
          mostrar en el mapa.
        </AppAlert>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        loadingEnabled
        showsCompass
        showsBuildings
        showsTraffic={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        onMapReady={() => {
          mapReadyRef.current = true;
          fitClients();
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

      <View style={styles.counter}>
        <AppText variant="labelMedium" weight="semibold">
          {clients.length === 1
            ? "1 ubicación"
            : `${clients.length} ubicaciones`}
        </AppText>
      </View>
    </View>
  );
}

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
