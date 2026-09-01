import { ChevronLeft, ChevronRight } from "lucide-react-native";

import {
  AppButton,
  AppCard,
  AppGrid,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationsPaginationProps {
  page: number;

  totalPages: number;

  total: number;

  limit: number;

  loading?: boolean;

  onPageChange: (page: number) => void;
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function InstallationsPagination({
  page,
  totalPages,
  total,
  limit,
  loading = false,
  onPageChange,
}: InstallationsPaginationProps) {
  /*
   * =======================================================
   * NORMALIZATION
   * =======================================================
   */

  const safeTotalPages = Math.max(totalPages, 1);

  const safePage = Math.min(
    Math.max(page, 1),

    safeTotalPages,
  );

  /*
   * =======================================================
   * RANGE
   * =======================================================
   */

  const from = total > 0 ? (safePage - 1) * limit + 1 : 0;

  const to =
    total > 0
      ? Math.min(
          safePage * limit,

          total,
        )
      : 0;

  /*
   * =======================================================
   * NAVIGATION
   * =======================================================
   */

  const canGoPrevious = safePage > 1;

  const canGoNext = safePage < safeTotalPages;

  return (
    <AppCard variant="tonal" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            META
           =============================================== */}

        <AppInline gap="sm" align="center" justify="space-between" wrap>
          <AppText variant="bodySmall" tone="secondary">
            {`Mostrando ${from}-${to} de ${total}`}
          </AppText>

          <AppText variant="bodySmall" weight="semibold">
            {`Página ${safePage} de ${safeTotalPages}`}
          </AppText>
        </AppInline>

        {/* ===============================================
            CONTROLS
           =============================================== */}

        <AppGrid gap="sm" minItemWidth={140}>
          <AppButton
            size="md"
            variant="outlined"
            tone="neutral"
            leadingIcon={ChevronLeft}
            fullWidth
            disabled={!canGoPrevious || loading}
            accessibilityLabel="Ir a la página anterior de instalaciones"
            onPress={() => {
              if (!canGoPrevious || loading) {
                return;
              }

              onPageChange(safePage - 1);
            }}
          >
            Anterior
          </AppButton>

          <AppButton
            size="md"
            variant="outlined"
            tone="primary"
            trailingIcon={ChevronRight}
            fullWidth
            disabled={!canGoNext || loading}
            accessibilityLabel="Ir a la página siguiente de instalaciones"
            onPress={() => {
              if (!canGoNext || loading) {
                return;
              }

              onPageChange(safePage + 1);
            }}
          >
            Siguiente
          </AppButton>
        </AppGrid>

        {loading ? (
          <AppText variant="bodySmall" tone="secondary" align="center">
            Cargando página...
          </AppText>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
