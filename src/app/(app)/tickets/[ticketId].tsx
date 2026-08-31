import { useLocalSearchParams } from "expo-router";

import { ModulePlaceholderScreen } from "@/features/dashboard";

export default function TicketDetailRoute() {
  const { ticketId } = useLocalSearchParams<{
    ticketId?: string;
  }>();

  return (
    <ModulePlaceholderScreen
      title={ticketId ? `Ticket #${ticketId}` : "Detalle del ticket"}
      description="Detalle técnico del ticket asignado."
    />
  );
}
