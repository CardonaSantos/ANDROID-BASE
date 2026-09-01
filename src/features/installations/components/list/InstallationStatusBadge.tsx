import { AppBadge } from "@/design-system";

import type { InstallationStatus } from "../../api/installations.contracts.api";

import { getInstallationStatusMeta } from "../../installations.helpers";

export interface InstallationStatusBadgeProps {
  status: InstallationStatus;
}

export function InstallationStatusBadge({
  status,
}: InstallationStatusBadgeProps) {
  const meta = getInstallationStatusMeta(status);

  return (
    <AppBadge
      size="sm"
      tone={meta.tone}
      variant="soft"
      accessibilityLabel={`Estado de instalación: ${meta.label}`}
    >
      {meta.label}
    </AppBadge>
  );
}
