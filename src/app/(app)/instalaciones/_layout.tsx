import { Stack } from "expo-router";

export default function InstallationsLayout() {
  return (
    <Stack
      screenOptions={{
        /*
         * El App Shell conserva el header principal.
         *
         * Las rutas internas de instalaciones controlan
         * sus propias barras y acciones.
         */
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="[instalacionId]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="[instalacionId]/evidencias"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="[instalacionId]/completar"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
