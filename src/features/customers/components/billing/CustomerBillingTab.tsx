import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Receipt,
  Wallet,
} from "lucide-react-native";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppGrid,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  CustomerInvoice,
  CustomerProfile,
} from "../../api/customers.contracts.api";
import {
  formatCustomerDate,
  formatCustomerMoney,
  formatCustomerStatus,
  getCustomerStatusTone,
  paginateCustomerItems,
  sortCustomerInvoicesNewestFirst,
} from "../../customers.helpers";
import { CustomerSectionCard } from "../shared/CustomerSectionCard";

const INVOICES_PER_PAGE = 5;

export interface CustomerBillingTabProps {
  customer: CustomerProfile;
}

function CompactMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  return (
    <AppCard variant="tonal" tone={tone} radius="md" padding="xs">
      <AppStack gap="xxs">
        <AppText variant="caption" tone="secondary">
          {label}
        </AppText>
        <AppText variant="bodyMedium" weight="bold">
          {value}
        </AppText>
      </AppStack>
    </AppCard>
  );
}

function CustomerInvoiceCard({ invoice }: { invoice: CustomerInvoice }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AppCard variant="outlined" radius="md" padding="sm">
      <AppStack gap="sm">
        <AppInline gap="sm" align="center" justify="space-between">
          <AppStack gap="xxs" flex>
            <AppText variant="bodySmall" weight="semibold">
              Factura #{invoice.id}
            </AppText>
            <AppText variant="caption" tone="secondary">
              {invoice.periodo || formatCustomerDate(invoice.fechaEmision)}
            </AppText>
          </AppStack>

          <AppBadge
            size="sm"
            variant="soft"
            tone={getCustomerStatusTone(invoice.estado)}
          >
            {formatCustomerStatus(invoice.estado)}
          </AppBadge>
        </AppInline>

        <AppGrid gap="xs" minItemWidth={120}>
          <CompactMetric
            label="Monto"
            value={formatCustomerMoney(invoice.monto)}
            tone="neutral"
          />
          <CompactMetric
            label="Pagos"
            value={String(invoice.pagos.length)}
            tone={invoice.pagos.length > 0 ? "success" : "neutral"}
          />
        </AppGrid>

        <AppInline gap="sm" align="center" justify="space-between" wrap>
          <AppText variant="caption" tone="secondary">
            Emisión: {formatCustomerDate(invoice.fechaEmision)}
          </AppText>

          <AppText variant="caption" tone="secondary">
            Vence: {formatCustomerDate(invoice.fechaVencimiento)}
          </AppText>
        </AppInline>

        {invoice.pagos.length > 0 ? (
          <>
            <AppButton
              size="sm"
              variant="ghost"
              tone="neutral"
              trailingIcon={expanded ? ChevronUp : ChevronDown}
              onPress={() => setExpanded((current) => !current)}
            >
              {expanded
                ? "Ocultar pagos"
                : `Ver pagos (${invoice.pagos.length})`}
            </AppButton>

            {expanded ? (
              <AppStack gap="xs">
                {invoice.pagos.map((payment, index) => (
                  <AppCard
                    key={`${invoice.id}-${payment.fechaPago}-${index}`}
                    variant="tonal"
                    radius="md"
                    padding="xs"
                  >
                    <AppInline gap="sm" align="center" justify="space-between">
                      <AppStack gap="xxs" flex>
                        <AppText variant="bodySmall" weight="semibold">
                          {payment.metodoPago.replace(/_/g, " ")}
                        </AppText>
                        <AppText variant="caption" tone="secondary">
                          {formatCustomerDate(payment.fechaPago)}
                          {payment.cobrador?.nombreCobrador
                            ? ` · ${payment.cobrador.nombreCobrador}`
                            : ""}
                        </AppText>
                      </AppStack>

                      <AppText variant="bodySmall" weight="bold">
                        {formatCustomerMoney(payment.montoPagado)}
                      </AppText>
                    </AppInline>
                  </AppCard>
                ))}
              </AppStack>
            ) : null}
          </>
        ) : (
          <AppText variant="caption" tone="secondary">
            Sin pagos registrados en esta factura.
          </AppText>
        )}
      </AppStack>
    </AppCard>
  );
}

export function CustomerBillingTab({ customer }: CustomerBillingTabProps) {
  const [page, setPage] = useState(1);

  const invoices = useMemo(
    () => sortCustomerInvoicesNewestFirst(customer.facturaInternet),
    [customer.facturaInternet],
  );

  const pagination = useMemo(
    () => paginateCustomerItems(invoices, page, INVOICES_PER_PAGE),
    [invoices, page],
  );

  useEffect(() => {
    if (page !== pagination.page) {
      setPage(pagination.page);
    }
  }, [page, pagination.page]);

  const totalPaid = useMemo(
    () =>
      customer.facturaInternet.reduce(
        (total, invoice) =>
          total +
          invoice.pagos.reduce(
            (paymentTotal, payment) => paymentTotal + payment.montoPagado,
            0,
          ),
        0,
      ),
    [customer.facturaInternet],
  );

  return (
    <AppStack gap="sm">
      <CustomerSectionCard title="Resumen financiero" icon={Wallet}>
        <AppGrid gap="xs" minItemWidth={105}>
          <CompactMetric
            label="Pendiente"
            value={formatCustomerMoney(customer.saldoCliente?.saldoPendiente)}
            tone={customer.saldoCliente?.saldoPendiente ? "danger" : "success"}
          />
          <CompactMetric
            label="Pagado"
            value={formatCustomerMoney(totalPaid)}
            tone="success"
          />
          <CompactMetric
            label="Facturas"
            value={String(customer.facturaInternet.length)}
            tone="info"
          />
        </AppGrid>

        <AppText variant="caption" tone="secondary">
          Último pago: {formatCustomerDate(customer.saldoCliente?.ultimoPago)}
        </AppText>
      </CustomerSectionCard>

      <CustomerSectionCard
        title="Historial de facturación"
        icon={Receipt}
        description={`${customer.facturaInternet.length} ${
          customer.facturaInternet.length === 1
            ? "factura registrada"
            : "facturas registradas"
        }`}
      >
        {pagination.items.length > 0 ? (
          <AppStack gap="sm">
            {pagination.items.map((invoice) => (
              <CustomerInvoiceCard key={invoice.id} invoice={invoice} />
            ))}

            {pagination.totalPages > 1 ? (
              <AppCard variant="tonal" radius="md" padding="xs">
                <AppStack gap="xs">
                  <AppInline gap="sm" align="center" justify="space-between">
                    <AppText variant="caption" tone="secondary">
                      {pagination.from}-{pagination.to} de {pagination.totalItems}
                    </AppText>
                    <AppText variant="caption" weight="semibold">
                      Página {pagination.page} / {pagination.totalPages}
                    </AppText>
                  </AppInline>

                  <AppInline gap="xs" align="center" justify="space-between">
                    <AppButton
                      size="sm"
                      variant="ghost"
                      tone="neutral"
                      leadingIcon={ChevronLeft}
                      disabled={pagination.page <= 1}
                      onPress={() => setPage((current) => current - 1)}
                    >
                      Anterior
                    </AppButton>

                    <AppButton
                      size="sm"
                      variant="ghost"
                      tone="neutral"
                      trailingIcon={ChevronRight}
                      disabled={pagination.page >= pagination.totalPages}
                      onPress={() => setPage((current) => current + 1)}
                    >
                      Siguiente
                    </AppButton>
                  </AppInline>
                </AppStack>
              </AppCard>
            ) : null}
          </AppStack>
        ) : (
          <AppText variant="bodySmall" tone="secondary">
            Este cliente no tiene facturas registradas.
          </AppText>
        )}
      </CustomerSectionCard>
    </AppStack>
  );
}
