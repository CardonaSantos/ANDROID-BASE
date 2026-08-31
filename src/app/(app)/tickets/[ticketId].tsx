import { useLocalSearchParams, useRouter } from "expo-router";

import * as Clipboard from "expo-clipboard";

import { TicketDetailScreen } from "@/features/tickets/presentation/TicketDetailScreen";

export default function TicketDetailRoute() {
  const router = useRouter();

  const { ticketId: ticketIdParam } = useLocalSearchParams<{
    ticketId?: string;
  }>();

  /*
   * Expo Router entrega los params como strings.
   *
   * Si por cualquier motivo no viene o no puede
   * convertirse a entero, TicketDetailScreen
   * recibe 0 y muestra su estado de ID inválido.
   */
  const ticketId = Number(ticketIdParam ?? 0);

  const handleBack = () => {
    /*
     * Entrada habitual:
     *
     * /tickets
     *    ↓
     * /tickets/:ticketId
     *
     * En ese caso conservamos la navegación natural.
     *
     * Para entrada directa / deep link dejamos
     * /tickets como fallback.
     */
    if (router.canGoBack()) {
      router.back();

      return;
    }

    router.replace("/tickets");
  };

  const handleCopyText = async (value: string) => {
    await Clipboard.setStringAsync(value);
  };

  return (
    <TicketDetailScreen
      ticketId={ticketId}
      onBack={handleBack}
      onCopyText={handleCopyText}
    />
  );
}
