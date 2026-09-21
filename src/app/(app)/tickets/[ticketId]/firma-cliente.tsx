import { useLocalSearchParams, useRouter } from "expo-router";

import { TicketClientSignatureScreen } from "@/features/tickets/presentation/TicketClientSignatureScreen";

export default function TicketClientSignatureRoute() {
  const router = useRouter();

  const { ticketId: ticketIdParam } = useLocalSearchParams<{
    ticketId?: string;
  }>();

  const ticketId = Number(ticketIdParam ?? 0);

  const goToTicket = () => {
    if (Number.isInteger(ticketId) && ticketId > 0) {
      router.replace({
        pathname: "/tickets/[ticketId]",
        params: {
          ticketId: String(ticketId),
        },
      });
      return;
    }

    router.replace("/tickets");
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    goToTicket();
  };

  return (
    <TicketClientSignatureScreen
      ticketId={ticketId}
      onBack={handleBack}
      onCompleted={goToTicket}
    />
  );
}
