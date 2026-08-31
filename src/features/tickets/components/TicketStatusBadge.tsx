import { AppBadge } from "@/design-system";

import type { TicketStatus } from "../api/tickets.contracts.api";

import { getTicketStatusMeta } from "../tickets.helpers";

export interface TicketStatusBadgeProps {
  status: TicketStatus;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const meta = getTicketStatusMeta(status);

  return (
    <AppBadge
      size="sm"
      variant="soft"
      tone={meta.tone}
      accessibilityLabel={`Estado: ${meta.label}`}
    >
      {meta.label}
    </AppBadge>
  );
}
