import { ClipboardCopy, Map, Route } from "lucide-react-native";
import { useState } from "react";
import { Linking } from "react-native";

import { AppButton, AppGrid, AppSnackbar } from "@/design-system";

import type { TicketLocation } from "../api/tickets.contracts.api";

export interface TicketLocationActionsProps {
  location?: TicketLocation | null;

  onCopy: (value: string) => void | Promise<void>;
}

function buildMapsUrl(location: TicketLocation): string {
  return (
    "https://www.google.com/maps/search/" +
    `?api=1&query=${location.lat},${location.lng}`
  );
}

function buildRouteUrl(location: TicketLocation): string {
  return (
    "https://www.google.com/maps/dir/" +
    `?api=1&destination=${location.lat},${location.lng}`
  );
}

function formatCoordinates(location: TicketLocation): string {
  return `${location.lat}, ${location.lng}`;
}

export function TicketLocationActions({
  location,
  onCopy,
}: TicketLocationActionsProps) {
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "success" | "danger";
  } | null>(null);

  const hasLocation = location !== null && location !== undefined;

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      setFeedback({
        message: "No se pudo abrir la ubicación.",
        tone: "danger",
      });
    }
  };

  const handleRoute = () => {
    if (!location) {
      return;
    }

    void openUrl(buildRouteUrl(location));
  };

  const handleMap = () => {
    if (!location) {
      return;
    }

    void openUrl(buildMapsUrl(location));
  };

  const handleCopy = async () => {
    if (!location) {
      return;
    }

    try {
      await onCopy(formatCoordinates(location));

      setFeedback({
        message: "Coordenadas copiadas",
        tone: "success",
      });
    } catch {
      setFeedback({
        message: "No se pudieron copiar las coordenadas.",
        tone: "danger",
      });
    }
  };

  if (!hasLocation) {
    return null;
  }

  return (
    <>
      <AppGrid gap="xs" minItemWidth={86}>
        <AppButton
          size="sm"
          variant="soft"
          tone="primary"
          leadingIcon={Route}
          fullWidth
          accessibilityLabel="Iniciar ruta hacia el cliente"
          onPress={handleRoute}
        >
          Ruta
        </AppButton>

        <AppButton
          size="sm"
          variant="outlined"
          tone="neutral"
          leadingIcon={Map}
          fullWidth
          accessibilityLabel="Abrir ubicación del cliente en el mapa"
          onPress={handleMap}
        >
          Mapa
        </AppButton>

        <AppButton
          size="sm"
          variant="ghost"
          tone="neutral"
          leadingIcon={ClipboardCopy}
          fullWidth
          accessibilityLabel="Copiar coordenadas del cliente"
          onPress={() => {
            void handleCopy();
          }}
        >
          GPS
        </AppButton>
      </AppGrid>

      <AppSnackbar
        open={feedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFeedback(null);
          }
        }}
        message={feedback?.message ?? ""}
        tone={feedback?.tone ?? "success"}
        position="bottom"
      />
    </>
  );
}
