import { useLocalSearchParams, useRouter } from "expo-router";

import * as Clipboard from "expo-clipboard";

import { TicketDetailScreen } from "@/features/tickets/presentation/TicketDetailScreen";

export default function TicketDetailRoute() {
  const router = useRouter();

  const { ticketId: ticketIdParam } = useLocalSearchParams<{
    ticketId?: string;
  }>();

  const ticketId = Number(ticketIdParam ?? 0);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/tickets");
  };

  const handleCopyText = async (value: string) => {
    await Clipboard.setStringAsync(value);
  };

  const handleOpenClientProfile = (clientId: number) => {
    router.push({
      pathname: "/clientes/[clienteId]",
      params: {
        clienteId: String(clientId),
      },
    });
  };

  const handleOpenTechnicianSignature = () => {
    router.push({
      pathname: "/tickets/[ticketId]/firma-tecnico",
      params: {
        ticketId: String(ticketId),
      },
    });
  };

  const handleOpenClientSignature = () => {
    router.push({
      pathname: "/tickets/[ticketId]/firma-cliente",
      params: {
        ticketId: String(ticketId),
      },
    });
  };

  return (
    <TicketDetailScreen
      ticketId={ticketId}
      onBack={handleBack}
      onCopyText={handleCopyText}
      onOpenClientProfile={handleOpenClientProfile}
      onOpenTechnicianSignature={handleOpenTechnicianSignature}
      onOpenClientSignature={handleOpenClientSignature}
    />
  );
}
