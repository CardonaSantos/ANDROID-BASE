import { Stack } from "expo-router";

export default function TicketsLayout() {
  return (
    <Stack
      screenOptions={{
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

      <Stack.Screen
        name="[ticketId]/firma-tecnico"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="[ticketId]/firma-cliente"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
