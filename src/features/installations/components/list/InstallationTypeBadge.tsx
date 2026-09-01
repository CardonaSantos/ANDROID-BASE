import { AppBadge } from "@/design-system";

import type { InstallationType } from "../../api/installations.contracts.api";

import { getInstallationTypeLabel } from "../../installations.helpers";

export interface InstallationTypeBadgeProps {
  type: InstallationType;
}

export function InstallationTypeBadge({ type }: InstallationTypeBadgeProps) {
  const label = getInstallationTypeLabel(type);

  return (
    <AppBadge
      size="sm"
      tone="neutral"
      variant="outlined"
      accessibilityLabel={`Tipo de instalación: ${label}`}
    >
      {label}
    </AppBadge>
  );
}
