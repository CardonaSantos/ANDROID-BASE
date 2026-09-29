import { Stack } from "expo-router";

export default function CollectionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[rutaId]" options={{ headerShown: false }} />
      <Stack.Screen
        name="comprobante/[facturaId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
