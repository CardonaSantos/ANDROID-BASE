import { ChevronLeft, ChevronRight } from "lucide-react-native";

import {
  AppButton,
  AppCard,
  AppGrid,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

export interface TicketsPaginationProps {
  page: number;

  totalPages: number;

  total: number;

  limit: number;

  onPageChange: (page: number) => void;
}

export function TicketsPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: TicketsPaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);

  const safePage = Math.min(Math.max(page, 1), safeTotalPages);

  const from = total > 0 ? (safePage - 1) * limit + 1 : 0;

  const to = total > 0 ? Math.min(safePage * limit, total) : 0;

  const canGoPrevious = safePage > 1;

  const canGoNext = safePage < safeTotalPages;

  return (
    <AppCard variant="tonal" radius="lg" padding="md">
      <AppStack gap="md">
        <AppInline gap="sm" align="center" justify="space-between" wrap>
          <AppText variant="bodySmall" tone="secondary">
            {`Mostrando ${from}-${to} de ${total}`}
          </AppText>

          <AppText variant="bodySmall" weight="semibold">
            {`Página ${safePage} de ${safeTotalPages}`}
          </AppText>
        </AppInline>

        <AppGrid gap="sm" minItemWidth={140}>
          <AppButton
            size="md"
            variant="outlined"
            tone="neutral"
            leadingIcon={ChevronLeft}
            fullWidth
            disabled={!canGoPrevious}
            accessibilityLabel="Ir a la página anterior de tickets"
            onPress={() => {
              if (!canGoPrevious) {
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
            disabled={!canGoNext}
            accessibilityLabel="Ir a la página siguiente de tickets"
            onPress={() => {
              if (!canGoNext) {
                return;
              }

              onPageChange(safePage + 1);
            }}
          >
            Siguiente
          </AppButton>
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
