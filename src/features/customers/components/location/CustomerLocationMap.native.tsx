import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native-unistyles";

import type { CustomerLocation } from "../../api/customers.contracts.api";

export interface CustomerLocationMapProps {
  location: CustomerLocation;
  title: string;
  height?: number;
}

export function CustomerLocationMap({
  location,
  title,
  height = 250,
}: CustomerLocationMapProps) {
  const coordinate = {
    latitude: location.latitud,
    longitude: location.longitud,
  };

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...coordinate,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
        showsCompass
        showsBuildings
        showsTraffic={false}
        toolbarEnabled={false}
      >
        <Marker coordinate={coordinate} title={title} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    width: "100%",
    overflow: "hidden",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  map: {
    width: "100%",
    height: "100%",
  },
}));
