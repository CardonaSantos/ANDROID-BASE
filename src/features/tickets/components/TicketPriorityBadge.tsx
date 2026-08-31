import { AppBadge } from "@/design-system";

import type { TicketPriority } from "../api/tickets.contracts.api";

import { getTicketPriorityMeta } from "../tickets.helpers";

export interface TicketPriorityBadgeProps {
  priority: TicketPriority;
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const meta = getTicketPriorityMeta(priority);

  return (
    <AppBadge
      size="sm"
      variant="soft"
      tone={meta.tone}
      accessibilityLabel={`Prioridad: ${meta.label}`}
    >
      {meta.label}
    </AppBadge>
  );
}
