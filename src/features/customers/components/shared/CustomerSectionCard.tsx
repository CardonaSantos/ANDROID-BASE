import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react-native";

import {
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

export interface CustomerSectionCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  description?: string;
}

export function CustomerSectionCard({
  title,
  icon,
  children,
  description,
}: CustomerSectionCardProps) {
  return (
    <AppCard variant="outlined" radius="md" padding="sm">
      <AppStack gap="sm">
        <AppInline gap="xs" align="center">
          <AppIcon icon={icon} size="sm" tone="primary" decorative />

          <AppStack gap="xxs" flex>
            <AppText variant="bodyMedium" weight="semibold">
              {title}
            </AppText>

            {description ? (
              <AppText variant="caption" tone="secondary">
                {description}
              </AppText>
            ) : null}
          </AppStack>
        </AppInline>

        {children}
      </AppStack>
    </AppCard>
  );
}
