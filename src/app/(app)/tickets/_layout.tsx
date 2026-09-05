import { Stack } from "expo-router";

export default function TicketsLayout() {
  return (
    <Stack
      screenOptions={{
        /*
         * El header principal pertenece al App Shell / Drawer.
         *
         * Las propias pantallas de detalle ya tienen
         * AppTopBar para su navegación local.
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
        name="[ticketId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
