import type { ReactNode } from "react";

import { AppStack, AppText } from "@/design-system";

export interface CustomerInfoFieldProps {
  label: string;
  value?: ReactNode;
  emptyText?: string;
}

export function CustomerInfoField({
  label,
  value,
  emptyText = "No registrado",
}: CustomerInfoFieldProps) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <AppStack gap="xxs">
      <AppText variant="labelSmall" tone="secondary" weight="medium">
        {label}
      </AppText>

      {hasValue ? (
        typeof value === "string" || typeof value === "number" ? (
          <AppText variant="bodySmall" numberOfLines={3}>
            {value}
          </AppText>
        ) : (
          value
        )
      ) : (
        <AppText variant="bodySmall" tone="secondary">
          {emptyText}
        </AppText>
      )}
    </AppStack>
  );
}
