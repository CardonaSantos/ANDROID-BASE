import { Gauge, Hash, WalletCards, Wifi } from "lucide-react-native";

import {
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { InstallationTechnicalDetail } from "../../api/installations.contracts.api";

import { formatInstallationMoney } from "../../installations.helpers";

export interface InstallationServiceSectionProps {
  installation: InstallationTechnicalDetail;
}

export function InstallationServiceSection({
  installation,
}: InstallationServiceSectionProps) {
  const service = installation.servicioInternet;

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="center">
          <AppIcon icon={Wifi} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Servicio de internet
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              Plan asociado a la instalación.
            </AppText>
          </AppStack>
        </AppInline>

        {/* ===============================================
            SIN SERVICIO
           =============================================== */}

        {!service ? (
          <AppCard variant="tonal" radius="md" padding="md">
            <AppText variant="bodyMedium" tone="secondary">
              Esta instalación no tiene un servicio de internet asociado.
            </AppText>
          </AppCard>
        ) : (
          <>
            {/* ===========================================
                NOMBRE
               =========================================== */}

            <AppStack gap="xs">
              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Plan
              </AppText>

              <AppText variant="titleMedium" weight="semibold">
                {service.nombre}
              </AppText>
            </AppStack>

            {/* ===========================================
                DATOS
               =========================================== */}

            <AppGrid gap="md" minItemWidth={140}>
              <AppCard variant="tonal" radius="md" padding="sm">
                <AppInline gap="sm" align="center">
                  <AppIcon icon={Hash} size="sm" tone="muted" decorative />

                  <AppStack gap="xs" flex>
                    <AppText variant="bodySmall" tone="secondary">
                      Servicio ID
                    </AppText>

                    <AppText variant="bodyMedium" weight="semibold">
                      {`#${service.id}`}
                    </AppText>
                  </AppStack>
                </AppInline>
              </AppCard>

              <AppCard variant="tonal" radius="md" padding="sm">
                <AppInline gap="sm" align="center">
                  <AppIcon icon={Gauge} size="sm" tone="muted" decorative />

                  <AppStack gap="xs" flex>
                    <AppText variant="bodySmall" tone="secondary">
                      Velocidad
                    </AppText>

                    <AppText variant="bodyMedium" weight="semibold">
                      {service.velocidad || "Sin velocidad registrada"}
                    </AppText>
                  </AppStack>
                </AppInline>
              </AppCard>

              <AppCard variant="tonal" radius="md" padding="sm">
                <AppInline gap="sm" align="center">
                  <AppIcon
                    icon={WalletCards}
                    size="sm"
                    tone="muted"
                    decorative
                  />

                  <AppStack gap="xs" flex>
                    <AppText variant="bodySmall" tone="secondary">
                      Precio
                    </AppText>

                    <AppText variant="bodyMedium" weight="semibold">
                      {service.precio !== null
                        ? formatInstallationMoney(service.precio)
                        : "Sin precio registrado"}
                    </AppText>
                  </AppStack>
                </AppInline>
              </AppCard>
            </AppGrid>
          </>
        )}
      </AppStack>
    </AppCard>
  );
}
