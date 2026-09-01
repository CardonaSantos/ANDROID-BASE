import {
  CircleCheckBig,
  FileText,
  Info,
  StickyNote,
} from "lucide-react-native";

import {
  AppCard,
  AppDivider,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type { InstallationTechnicalDetail } from "../../api/installations.contracts.api";

export interface InstallationWorkSectionProps {
  installation: InstallationTechnicalDetail;
}

export function InstallationWorkSection({
  installation,
}: InstallationWorkSectionProps) {
  const description = installation.trabajo.descripcion?.trim() ?? "";

  const reason = installation.trabajo.motivo?.trim() ?? "";

  const observations = installation.trabajo.observaciones?.trim() ?? "";

  const result = installation.trabajo.resultado?.trim() ?? "";

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="center">
          <AppIcon icon={FileText} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Trabajo
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              Información operativa registrada para esta instalación.
            </AppText>
          </AppStack>
        </AppInline>

        {/* ===============================================
            DESCRIPCIÓN
           =============================================== */}

        <AppStack gap="xs">
          <AppText variant="bodySmall" tone="secondary" weight="semibold">
            Descripción
          </AppText>

          <AppText variant="bodyMedium">
            {description || "Sin descripción registrada."}
          </AppText>
        </AppStack>

        <AppDivider />

        {/* ===============================================
            MOTIVO
           =============================================== */}

        <AppStack gap="sm">
          <AppInline gap="xs" align="center">
            <AppIcon icon={Info} size="sm" tone="muted" decorative />

            <AppText variant="bodySmall" tone="secondary" weight="semibold">
              Motivo
            </AppText>
          </AppInline>

          <AppText variant="bodyMedium">
            {reason || "Sin motivo adicional registrado."}
          </AppText>
        </AppStack>

        <AppDivider />

        {/* ===============================================
            OBSERVACIONES
           =============================================== */}

        <AppStack gap="sm">
          <AppInline gap="xs" align="center">
            <AppIcon icon={StickyNote} size="sm" tone="muted" decorative />

            <AppText variant="bodySmall" tone="secondary" weight="semibold">
              Observaciones
            </AppText>
          </AppInline>

          <AppText variant="bodyMedium">
            {observations || "Sin observaciones registradas."}
          </AppText>
        </AppStack>

        {/* ===============================================
            RESULTADO
           =============================================== */}

        {result ? (
          <>
            <AppDivider />

            <AppCard variant="tonal" radius="md" padding="sm">
              <AppInline gap="sm" align="flex-start">
                <AppIcon
                  icon={CircleCheckBig}
                  size="sm"
                  tone="success"
                  decorative
                />

                <AppStack gap="xs" flex>
                  <AppText
                    variant="bodySmall"
                    tone="secondary"
                    weight="semibold"
                  >
                    Resultado
                  </AppText>

                  <AppText variant="bodyMedium">{result}</AppText>
                </AppStack>
              </AppInline>
            </AppCard>
          </>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
