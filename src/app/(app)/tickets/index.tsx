import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";

import { TicketsAssignedScreen } from "@/features/tickets/presentation";

export default function TicketsScreen() {
  const router = useRouter();

  const handleOpenDetails = (ticketId: number) => {
    router.push({
      pathname: "/tickets/[ticketId]",
      params: {
        ticketId: String(ticketId),
      },
    });
  };

  const handleCopyText = async (value: string) => {
    await Clipboard.setStringAsync(value);
  };

  return (
    <TicketsAssignedScreen
      onOpenDetails={handleOpenDetails}
      onCopyText={handleCopyText}
    />
  );
}
