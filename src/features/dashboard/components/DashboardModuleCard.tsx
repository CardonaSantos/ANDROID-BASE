import { ChevronRight } from "lucide-react-native";

import {
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { DashboardModule } from "../dashboard.types";

export interface DashboardModuleCardProps {
  module: DashboardModule;

  onPress: () => void;
}

export function DashboardModuleCard({
  module,
  onPress,
}: DashboardModuleCardProps) {
  const Icon = module.icon;

  return (
    <AppCard
      onPress={onPress}
      accessibilityLabel={module.title}
      accessibilityHint={module.description}
      contentStyle={{
        minHeight: 140,
      }}
    >
      <AppStack gap="lg">
        <AppIcon icon={Icon} size="lg" tone="primary" decorative />

        <AppInline gap="md" align="center">
          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              {module.title}
            </AppText>

            <AppText variant="bodySmall" tone="muted">
              {module.description}
            </AppText>
          </AppStack>

          <AppIcon icon={ChevronRight} size="sm" tone="muted" decorative />
        </AppInline>
      </AppStack>
    </AppCard>
  );
}
