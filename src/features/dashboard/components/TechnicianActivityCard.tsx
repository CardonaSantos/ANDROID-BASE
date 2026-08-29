import { Activity } from "lucide-react-native";

import {
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  TechnicianPanelActivityDay,
  TechnicianPanelActivitySummary,
} from "../api";

interface TechnicianActivityCardProps {
  summary: TechnicianPanelActivitySummary;

  activity: TechnicianPanelActivityDay[];
}

function ActivitySummary({
  label,
  day,
}: {
  label: string;

  day: TechnicianPanelActivityDay | null;
}) {
  return (
    <AppStack gap="xs">
      <AppText variant="labelMedium" tone="muted">
        {label}
      </AppText>

      {day ? (
        <>
          <AppText variant="titleMedium" weight="semibold">
            {day.etiqueta}
          </AppText>

          <AppText variant="bodySmall" tone="muted">
            {day.total} trabajos · {day.tickets} tickets · {day.instalaciones}{" "}
            instalaciones
          </AppText>
        </>
      ) : (
        <AppText variant="bodySmall" tone="muted">
          Sin actividad registrada
        </AppText>
      )}
    </AppStack>
  );
}

export function TechnicianActivityCard({
  summary,
  activity,
}: TechnicianActivityCardProps) {
  const recentActivity = activity.slice(-7).reverse();

  return (
    <AppCard>
      <AppStack gap="lg">
        <AppInline gap="sm" align="center">
          <AppIcon icon={Activity} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Actividad
            </AppText>

            <AppText variant="bodySmall" tone="muted">
              Resumen de trabajo registrado
            </AppText>
          </AppStack>
        </AppInline>

        <AppGrid minItemWidth={180} gap="lg">
          <ActivitySummary
            label="Día más productivo"
            day={summary.diaMasProductivo}
          />

          <ActivitySummary
            label="Menor actividad"
            day={summary.diaMenosProductivoConActividad}
          />
        </AppGrid>

        {recentActivity.length > 0 ? (
          <AppStack gap="md">
            <AppText variant="labelMedium" tone="muted">
              Últimos días
            </AppText>

            <AppGrid minItemWidth={140} gap="md">
              {recentActivity.map((day) => (
                <AppStack key={day.fecha} gap="xs">
                  <AppText variant="bodySmall" weight="semibold">
                    {day.etiqueta}
                  </AppText>

                  <AppText variant="bodySmall" tone="muted">
                    {day.total} trabajos
                  </AppText>

                  <AppText variant="bodySmall" tone="muted">
                    {day.tickets} T · {day.instalaciones} I
                  </AppText>
                </AppStack>
              ))}
            </AppGrid>
          </AppStack>
        ) : (
          <AppText variant="bodySmall" tone="muted">
            Todavía no existe actividad registrada durante este período.
          </AppText>
        )}
      </AppStack>
    </AppCard>
  );
}
