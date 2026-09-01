import { Barcode, Boxes, Hash, Package, Star } from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  InstallationTechnicalDetail,
  InstallationTechnicalEquipment,
} from "../../api/installations.contracts.api";

export interface InstallationEquipmentSectionProps {
  installation: InstallationTechnicalDetail;
}

/*
 * =========================================================
 * EQUIPMENT CARD
 * =========================================================
 */

interface EquipmentCardProps {
  equipment: InstallationTechnicalEquipment;
}

function EquipmentCard({ equipment }: EquipmentCardProps) {
  const name =
    equipment.productoNombre?.trim() ||
    equipment.descripcion?.trim() ||
    `Equipo #${equipment.id}`;

  return (
    <AppCard variant="tonal" radius="md" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="flex-start" justify="space-between" wrap>
          <AppInline gap="sm" align="flex-start" flex>
            <AppIcon
              icon={Package}
              size="sm"
              tone={equipment.esPrincipal ? "primary" : "muted"}
              decorative
            />

            <AppStack gap="xs" flex>
              <AppText variant="bodySmall" tone="secondary">
                {`Equipo #${equipment.id}`}
              </AppText>

              <AppText
                variant="titleMedium"
                weight="semibold"
                numberOfLines={2}
              >
                {name}
              </AppText>
            </AppStack>
          </AppInline>

          {equipment.esPrincipal ? (
            <AppBadge icon={Star} size="sm" tone="primary" variant="soft">
              Principal
            </AppBadge>
          ) : null}
        </AppInline>

        {/* ===============================================
            IDENTIFIERS
           =============================================== */}

        <AppGrid gap="md" minItemWidth={140}>
          <AppStack gap="xs">
            <AppInline gap="xs" align="center">
              <AppIcon icon={Hash} size="sm" tone="muted" decorative />

              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Producto ID
              </AppText>
            </AppInline>

            <AppText variant="bodyMedium">
              {equipment.productoId
                ? `#${equipment.productoId}`
                : "Sin producto"}
            </AppText>
          </AppStack>

          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Cantidad
            </AppText>

            <AppText variant="bodyMedium" weight="semibold">
              {String(equipment.cantidad)}
            </AppText>
          </AppStack>

          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Serial de producto ID
            </AppText>

            <AppText variant="bodyMedium">
              {equipment.serialProductoId
                ? `#${equipment.serialProductoId}`
                : "Sin registro"}
            </AppText>
          </AppStack>
        </AppGrid>

        {/* ===============================================
            SERIAL
           =============================================== */}

        <AppCard variant="outlined" radius="md" padding="sm">
          <AppInline gap="sm" align="center">
            <AppIcon icon={Barcode} size="sm" tone="muted" decorative />

            <AppStack gap="xs" flex>
              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Número de serie
              </AppText>

              <AppText
                variant="bodyMedium"
                weight={equipment.serial ? "semibold" : "regular"}
              >
                {equipment.serial || "Sin serial registrado"}
              </AppText>
            </AppStack>
          </AppInline>
        </AppCard>

        {/* ===============================================
            DESCRIPTION
           =============================================== */}

        {equipment.descripcion && equipment.descripcion !== name ? (
          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Descripción
            </AppText>

            <AppText variant="bodyMedium">{equipment.descripcion}</AppText>
          </AppStack>
        ) : null}

        {/* ===============================================
            NOTES
           =============================================== */}

        {equipment.notas ? (
          <AppStack gap="xs">
            <AppText variant="bodySmall" tone="secondary" weight="medium">
              Notas
            </AppText>

            <AppText variant="bodySmall">{equipment.notas}</AppText>
          </AppStack>
        ) : null}
      </AppStack>
    </AppCard>
  );
}

/*
 * =========================================================
 * SECTION
 * =========================================================
 */

export function InstallationEquipmentSection({
  installation,
}: InstallationEquipmentSectionProps) {
  const equipment = installation.equipos;

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="center">
          <AppIcon icon={Boxes} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Equipos
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              Productos y seriales asociados a esta instalación.
            </AppText>
          </AppStack>

          {equipment.length > 0 ? (
            <AppBadge
              size="sm"
              tone="neutral"
              variant="soft"
              accessibilityLabel={`${equipment.length} equipos registrados`}
            >
              {`${equipment.length}`}
            </AppBadge>
          ) : null}
        </AppInline>

        {/* ===============================================
            EQUIPMENT
           =============================================== */}

        {equipment.length === 0 ? (
          <AppCard variant="tonal" radius="md" padding="md">
            <AppText variant="bodyMedium" tone="secondary">
              No hay equipos registrados para esta instalación.
            </AppText>
          </AppCard>
        ) : (
          <AppStack gap="md">
            {equipment.map((item) => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
          </AppStack>
        )}
      </AppStack>
    </AppCard>
  );
}
