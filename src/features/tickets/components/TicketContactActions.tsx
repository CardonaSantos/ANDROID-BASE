import { ClipboardCopy, MessageCircle, Phone } from "lucide-react-native";
import { useState } from "react";
import { Linking } from "react-native";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppGrid,
  AppInline,
  AppSnackbar,
  AppStack,
  AppText,
} from "@/design-system";

export type TicketContactAction = "whatsapp" | "call" | "copy";

export interface TicketContactActionsProps {
  label: string;

  phone?: string | null;

  compact?: boolean;

  onCopy: (phone: string) => void | Promise<void>;
}

function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-().]/g, "");
}

function buildWhatsappUrl(phone: string): string {
  return `https://wa.me/502${cleanPhoneNumber(phone)}`;
}

function buildPhoneUrl(phone: string): string {
  return `tel:+502${cleanPhoneNumber(phone)}`;
}

export function TicketContactActions({
  label,
  phone,
  compact = false,
  onCopy,
}: TicketContactActionsProps) {
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "success" | "danger";
  } | null>(null);

  const normalizedPhone = phone?.trim() ?? "";

  const hasPhone = normalizedPhone.length > 0;

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      setFeedback({
        message: "No se pudo abrir esta acción en el dispositivo.",
        tone: "danger",
      });
    }
  };

  const handleWhatsapp = () => {
    if (!hasPhone) {
      return;
    }

    void openUrl(buildWhatsappUrl(normalizedPhone));
  };

  const handleCall = () => {
    if (!hasPhone) {
      return;
    }

    void openUrl(buildPhoneUrl(normalizedPhone));
  };

  const handleCopy = async () => {
    if (!hasPhone) {
      return;
    }

    try {
      await onCopy(normalizedPhone);

      setFeedback({
        message: "Número copiado",
        tone: "success",
      });
    } catch {
      setFeedback({
        message: "No se pudo copiar el número.",
        tone: "danger",
      });
    }
  };

  return (
    <>
      <AppCard variant="outlined" radius="md" padding={compact ? "sm" : "md"}>
        <AppStack gap="sm">
          <AppInline gap="sm" align="center" justify="space-between">
            <AppStack gap="xs" flex={1}>
              <AppText
                variant="bodySmall"
                tone="secondary"
                weight="medium"
                numberOfLines={1}
              >
                {label}
              </AppText>

              <AppText variant="bodyMedium" weight="semibold" numberOfLines={1}>
                {hasPhone ? normalizedPhone : "Sin teléfono"}
              </AppText>
            </AppStack>

            {hasPhone ? (
              <AppBadge size="sm" tone="success" variant="soft">
                Disponible
              </AppBadge>
            ) : null}
          </AppInline>

          <AppGrid gap="xs" minItemWidth={86}>
            <AppButton
              size="sm"
              variant="soft"
              tone="success"
              leadingIcon={MessageCircle}
              fullWidth
              disabled={!hasPhone}
              accessibilityLabel={`Abrir WhatsApp con ${label}`}
              onPress={handleWhatsapp}
            >
              WA
            </AppButton>

            <AppButton
              size="sm"
              variant="outlined"
              tone="neutral"
              leadingIcon={Phone}
              fullWidth
              disabled={!hasPhone}
              accessibilityLabel={`Llamar a ${label}`}
              onPress={handleCall}
            >
              Llamar
            </AppButton>

            <AppButton
              size="sm"
              variant="ghost"
              tone="neutral"
              leadingIcon={ClipboardCopy}
              fullWidth
              disabled={!hasPhone}
              accessibilityLabel={`Copiar teléfono de ${label}`}
              onPress={() => {
                void handleCopy();
              }}
            >
              Copiar
            </AppButton>
          </AppGrid>
        </AppStack>
      </AppCard>

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
