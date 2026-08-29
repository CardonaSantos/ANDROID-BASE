import { Cloud, CloudOff, RefreshCw } from "lucide-react-native";

import { AppCard, AppIcon, AppStack, AppText } from "@/design-system";

import { useTrackingSyncStatusQuery } from "../hooks";

interface TrackingSyncCardProps {
  sessionId: number;
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Sin envíos todavía";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "short",

    timeStyle: "short",
  }).format(date);
}

export function TrackingSyncCard({ sessionId }: TrackingSyncCardProps) {
  const query = useTrackingSyncStatusQuery(sessionId);

  if (query.isPending) {
    return (
      <AppCard>
        <AppText>Consultando sincronización...</AppText>
      </AppCard>
    );
  }

  if (query.isError) {
    return (
      <AppCard>
        <AppText tone="muted">
          No fue posible leer el estado local de sincronización.
        </AppText>
      </AppCard>
    );
  }

  const status = query.data;

  return (
    <AppCard>
      <AppStack gap="lg">
        <AppStack gap="xs">
          <AppIcon
            icon={status.online ? Cloud : CloudOff}
            size="lg"
            tone={status.online ? "success" : "warning"}
            decorative
          />

          <AppText variant="titleMedium" weight="semibold">
            Sincronización
          </AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="labelMedium" tone="muted">
            Conexión
          </AppText>

          <AppText tone={status.online ? "success" : "warning"}>
            {status.online ? "En línea" : "Sin conexión"}
          </AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="labelMedium" tone="muted">
            Ubicaciones pendientes
          </AppText>

          <AppText>{status.pending}</AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppIcon icon={RefreshCw} size="sm" tone="muted" decorative />

          <AppText variant="labelMedium" tone="muted">
            Último envío
          </AppText>

          <AppText>{formatDate(status.lastSuccessfulSyncAt)}</AppText>
        </AppStack>

        <AppStack gap="xs">
          <AppText variant="labelMedium" tone="muted">
            Heartbeat confirmado
          </AppText>

          <AppText>{formatDate(status.lastServerHeartbeatAt)}</AppText>
        </AppStack>
      </AppStack>
    </AppCard>
  );
}
