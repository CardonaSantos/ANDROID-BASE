import {
  ClipboardCopy,
  Home,
  Map,
  MapPin,
  Navigation,
  Route,
} from "lucide-react-native";

import { useState } from "react";

import { Linking } from "react-native";

import {
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

import {
  buildInstallationMapsUrl,
  buildInstallationRouteUrl,
  getInstallationAddressText,
  getInstallationCoordinatesText,
  getInstallationReferenceText,
  hasInstallationCoordinates,
} from "../../installations.helpers";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationLocationSectionProps {
  installation: InstallationTechnicalDetail;

  onCopyText: (value: string) => void | Promise<void>;
}

/*
 * =========================================================
 * LOCATION SECTION
 * =========================================================
 */

export function InstallationLocationSection({
  installation,
  onCopyText,
}: InstallationLocationSectionProps) {
  const [feedback, setFeedback] = useState<{
    message: string;

    tone: "success" | "danger";
  } | null>(null);

  const location = installation.ubicacion;

  const address = getInstallationAddressText(location);

  const reference = getInstallationReferenceText(location);

  const coordinates = getInstallationCoordinatesText(location);

  const hasCoordinates = hasInstallationCoordinates(location);

  const clientAddress = installation.cliente.direccion?.trim() ?? "";

  /*
   * =======================================================
   * ACTIONS
   * =======================================================
   */

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
    const url = buildInstallationRouteUrl(location);

    if (!url) {
      return;
    }

    void openUrl(url);
  };

  const handleMap = () => {
    const url = buildInstallationMapsUrl(location);

    if (!url) {
      return;
    }

    void openUrl(url);
  };

  const handleCopyCoordinates = async () => {
    if (!coordinates) {
      return;
    }

    try {
      await onCopyText(coordinates);

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

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <>
      <AppCard variant="outlined" radius="lg" padding="md">
        <AppStack gap="md">
          {/* ===============================================
              HEADER
             =============================================== */}

          <AppInline gap="sm" align="center">
            <AppIcon icon={MapPin} size="md" tone="primary" decorative />

            <AppStack gap="xs" flex>
              <AppText variant="titleMedium" weight="semibold">
                Ubicación
              </AppText>

              <AppText variant="bodySmall" tone="secondary">
                Lugar exacto donde debe realizarse el trabajo.
              </AppText>
            </AppStack>
          </AppInline>

          {/* ===============================================
              DIRECCIÓN DE INSTALACIÓN
             =============================================== */}

          <AppStack gap="xs">
            <AppInline gap="xs" align="center">
              <AppIcon icon={Navigation} size="sm" tone="muted" decorative />

              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Dirección de instalación
              </AppText>
            </AppInline>

            <AppText variant="bodyMedium" weight="semibold">
              {address || "Sin dirección de instalación registrada"}
            </AppText>
          </AppStack>

          {/* ===============================================
              REFERENCIA
             =============================================== */}

          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Referencia
            </AppText>

            <AppText variant="bodyMedium">
              {reference || "Sin referencia registrada"}
            </AppText>
          </AppStack>

          {/* ===============================================
              DIRECCIÓN GENERAL DEL CLIENTE
             =============================================== */}

          {clientAddress ? (
            <AppCard variant="tonal" radius="md" padding="sm">
              <AppInline gap="sm" align="flex-start">
                <AppIcon icon={Home} size="sm" tone="muted" decorative />

                <AppStack gap="xs" flex>
                  <AppText variant="bodySmall" tone="secondary" weight="medium">
                    Dirección registrada del cliente
                  </AppText>

                  <AppText variant="bodySmall">{clientAddress}</AppText>
                </AppStack>
              </AppInline>
            </AppCard>
          ) : null}

          {/* ===============================================
              GPS
             =============================================== */}

          {hasCoordinates ? (
            <>
              <AppStack gap="xs">
                <AppText variant="bodySmall" tone="secondary" weight="medium">
                  Coordenadas GPS
                </AppText>

                <AppText variant="bodyMedium" weight="medium">
                  {coordinates}
                </AppText>
              </AppStack>

              <AppGrid gap="xs" minItemWidth={86}>
                <AppButton
                  size="sm"
                  variant="soft"
                  tone="primary"
                  leadingIcon={Route}
                  fullWidth
                  accessibilityLabel="Iniciar ruta hacia la instalación"
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
                  accessibilityLabel="Abrir ubicación de la instalación en el mapa"
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
                  accessibilityLabel="Copiar coordenadas de la instalación"
                  onPress={() => {
                    void handleCopyCoordinates();
                  }}
                >
                  GPS
                </AppButton>
              </AppGrid>
            </>
          ) : (
            <AppText variant="bodySmall" tone="secondary">
              Esta instalación no tiene coordenadas GPS registradas.
            </AppText>
          )}
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
