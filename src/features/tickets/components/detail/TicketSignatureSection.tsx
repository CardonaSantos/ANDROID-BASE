import { PenLine } from "lucide-react-native";

import {
  AppCard,
  AppDivider,
  AppIcon,
  AppListItem,
  AppSectionHeader,
  AppStack,
} from "@/design-system";

export interface TicketSignatureSectionProps {
  onOpenTechnicianSignature: () => void;
  onOpenClientSignature: () => void;
}

export function TicketSignatureSection({
  onOpenTechnicianSignature,
  onOpenClientSignature,
}: TicketSignatureSectionProps) {
  return (
    <AppCard variant="outlined" radius="lg" padding="sm">
      <AppStack gap="xs">
        <AppSectionHeader title="Firmas" description="" size="sm" />

        <AppListItem
          size="md"
          title="Firma del técnico"
          description=""
          leading={<AppIcon icon={PenLine} tone="primary" decorative />}
          disclosure
          accessibilityLabel="Registrar firma del técnico"
          accessibilityHint="Abre la pantalla de firma técnica."
          onPress={onOpenTechnicianSignature}
        />

        <AppDivider insetStart="lg" insetEnd="lg" />

        <AppListItem
          size="md"
          title="Firma del cliente"
          description=""
          leading={<AppIcon icon={PenLine} tone="info" decorative />}
          disclosure
          accessibilityLabel="Registrar firma del cliente"
          accessibilityHint="Abre la pantalla de conformidad y firma del cliente."
          onPress={onOpenClientSignature}
        />
      </AppStack>
    </AppCard>
  );
}
