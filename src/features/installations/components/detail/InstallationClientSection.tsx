import {
  ClipboardCopy,
  FileText,
  MessageCircle,
  Phone,
  User,
} from "lucide-react-native";

import { useState } from "react";

import { Linking } from "react-native";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppSnackbar,
  AppStack,
  AppText,
} from "@/design-system";

import type { InstallationTechnicalDetail } from "../../api/installations.contracts.api";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationClientSectionProps {
  installation: InstallationTechnicalDetail;

  onCopyText: (value: string) => void | Promise<void>;
}

/*
 * =========================================================
 * PHONE HELPERS
 * =========================================================
 */

function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-().]/g, "");
}

function normalizeGuatemalaPhone(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);

  if (cleaned.startsWith("+502")) {
    return cleaned;
  }

  if (cleaned.startsWith("502")) {
    return `+${cleaned}`;
  }

  return `+502${cleaned}`;
}

function buildPhoneUrl(phone: string): string {
  return `tel:${normalizeGuatemalaPhone(phone)}`;
}

function buildWhatsappUrl(phone: string): string {
  return `https://wa.me/${normalizeGuatemalaPhone(phone).replace("+", "")}`;
}

/*
 * =========================================================
 * CONTACT BLOCK
 * =========================================================
 */

interface ContactBlockProps {
  label: string;

  phone?: string | null;

  compact?: boolean;

  onCopy: (value: string) => void | Promise<void>;

  onFeedback: (value: {
    message: string;

    tone: "success" | "danger";
  }) => void;
}

function ContactBlock({
  label,
  phone,
  compact = false,
  onCopy,
  onFeedback,
}: ContactBlockProps) {
  const normalizedPhone = phone?.trim() ?? "";

  const hasPhone = normalizedPhone.length > 0;

  const openUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      onFeedback({
        message: "No se pudo abrir esta acción en el dispositivo.",

        tone: "danger",
      });
    }
  };

  const handleCopy = async () => {
    if (!hasPhone) {
      return;
    }

    try {
      await onCopy(normalizedPhone);

      onFeedback({
        message: "Número copiado",

        tone: "success",
      });
    } catch {
      onFeedback({
        message: "No se pudo copiar el número.",

        tone: "danger",
      });
    }
  };

  return (
    <AppCard variant="outlined" radius="md" padding={compact ? "sm" : "md"}>
      <AppStack gap="sm">
        <AppInline gap="sm" align="center" justify="space-between">
          <AppStack gap="xs" flex>
            <AppText variant="bodySmall" tone="secondary" weight="medium">
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
            onPress={() => {
              if (!hasPhone) {
                return;
              }

              void openUrl(buildWhatsappUrl(normalizedPhone));
            }}
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
            onPress={() => {
              if (!hasPhone) {
                return;
              }

              void openUrl(buildPhoneUrl(normalizedPhone));
            }}
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
  );
}

/*
 * =========================================================
 * CLIENT SECTION
 * =========================================================
 */

export function InstallationClientSection({
  installation,
  onCopyText,
}: InstallationClientSectionProps) {
  const [feedback, setFeedback] = useState<{
    message: string;

    tone: "success" | "danger";
  } | null>(null);

  const client = installation.cliente;

  return (
    <>
      <AppCard variant="outlined" radius="lg" padding="md">
        <AppStack gap="md">
          {/* ===============================================
              HEADER
             =============================================== */}

          <AppInline gap="sm" align="center">
            <AppIcon icon={User} size="md" tone="primary" decorative />

            <AppStack gap="xs" flex>
              <AppText variant="titleMedium" weight="semibold">
                Cliente
              </AppText>

              <AppText variant="bodySmall" tone="secondary">
                {`Cliente #${client.id}`}
              </AppText>
            </AppStack>
          </AppInline>

          {/* ===============================================
              IDENTIDAD
             =============================================== */}

          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Nombre
            </AppText>

            <AppText variant="titleMedium" weight="semibold">
              {client.nombreCompleto || "Cliente sin nombre"}
            </AppText>
          </AppStack>

          {/* ===============================================
              INFORMACIÓN PERSONAL / TERRITORIAL
             =============================================== */}

          <AppGrid gap="md" minItemWidth={150}>
            <AppStack gap="xs">
              <AppText variant="bodySmall" tone="secondary" weight="medium">
                DPI
              </AppText>

              <AppText variant="bodyMedium">
                {client.dpi || "Sin DPI registrado"}
              </AppText>
            </AppStack>

            <AppStack gap="xs">
              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Departamento
              </AppText>

              <AppText variant="bodyMedium">
                {client.departamento || "Sin departamento"}
              </AppText>
            </AppStack>

            <AppStack gap="xs">
              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Municipio
              </AppText>

              <AppText variant="bodyMedium">
                {client.municipio || "Sin municipio"}
              </AppText>
            </AppStack>

            <AppStack gap="xs">
              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Sector
              </AppText>

              <AppText variant="bodyMedium">
                {client.sector || "Sin sector"}
              </AppText>
            </AppStack>
          </AppGrid>

          {/* ===============================================
              CONTACTOS
             =============================================== */}

          <AppGrid gap="sm" minItemWidth={260}>
            <ContactBlock
              label="Contacto principal"
              phone={client.telefono}
              onCopy={onCopyText}
              onFeedback={setFeedback}
            />

            <ContactBlock
              label="Contacto de referencia"
              phone={client.telefonoReferencia}
              compact
              onCopy={onCopyText}
              onFeedback={setFeedback}
            />
          </AppGrid>

          {/* ===============================================
              OBSERVACIONES DEL CLIENTE
             =============================================== */}

          {client.observaciones ? (
            <AppCard variant="tonal" radius="md" padding="sm">
              <AppInline gap="sm" align="flex-start">
                <AppIcon icon={FileText} size="sm" tone="muted" decorative />

                <AppStack gap="xs" flex>
                  <AppText variant="bodySmall" tone="secondary" weight="medium">
                    Observaciones
                  </AppText>

                  <AppText variant="bodySmall">{client.observaciones}</AppText>
                </AppStack>
              </AppInline>
            </AppCard>
          ) : null}
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
