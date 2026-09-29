import {
  CalendarDays,
  ClipboardCopy,
  Contact,
  CreditCard,
  Globe,
  MapPin,
  Network,
  Package,
  Receipt,
  UserRound,
  Wifi,
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

import type { CustomerProfile } from "../../api/customers.contracts.api";
import {
  formatCustomerDate,
  formatCustomerMoney,
  formatCustomerStatus,
  getCustomerStatusTone,
} from "../../customers.helpers";
import { CustomerInfoField } from "../shared/CustomerInfoField";
import { CustomerSectionCard } from "../shared/CustomerSectionCard";

export interface CustomerOverviewTabProps {
  customer: CustomerProfile;
  onCopyText: (value: string) => void | Promise<void>;
}

export function CustomerOverviewTab({
  customer,
  onCopyText,
}: CustomerOverviewTabProps) {
  const referenceName = customer.contactoReferenciaNombre?.trim() || null;
  const referencePhone = customer.contactoReferenciaTelefono?.trim() || null;

  return (
    <AppStack gap="sm">
      <CustomerSectionCard title="Estado y saldo" icon={CreditCard}>
        <AppGrid gap="xs" minItemWidth={135}>
          <CustomerInfoField
            label="Estado"
            value={
              <AppBadge
                size="sm"
                variant="soft"
                tone={getCustomerStatusTone(customer.estadoCliente)}
              >
                {formatCustomerStatus(customer.estadoCliente)}
              </AppBadge>
            }
          />

          <CustomerInfoField
            label="Cobranza"
            value={
              <AppBadge
                size="sm"
                variant="soft"
                tone={getCustomerStatusTone(customer.estadoCobranza)}
              >
                {formatCustomerStatus(customer.estadoCobranza)}
              </AppBadge>
            }
          />

          <CustomerInfoField
            label="Saldo pendiente"
            value={formatCustomerMoney(customer.saldoCliente?.saldoPendiente)}
          />

          <CustomerInfoField
            label="Último pago"
            value={formatCustomerDate(customer.saldoCliente?.ultimoPago)}
          />
        </AppGrid>
      </CustomerSectionCard>

      <CustomerSectionCard title="Información personal" icon={UserRound}>
        <AppGrid gap="sm" minItemWidth={140}>
          <CustomerInfoField label="Teléfono" value={customer.telefono} />
          <CustomerInfoField label="DPI" value={customer.dpi} />
          <CustomerInfoField label="Asesor" value={customer.asesor?.nombre} />
          <CustomerInfoField
            label="Cliente desde"
            value={formatCustomerDate(customer.creadoEn)}
          />
        </AppGrid>

        {customer.telefono ? (
          <AppButton
            size="sm"
            variant="ghost"
            tone="primary"
            leadingIcon={ClipboardCopy}
            onPress={() => {
              void onCopyText(customer.telefono ?? "");
            }}
          >
            Copiar teléfono
          </AppButton>
        ) : null}

        {customer.observaciones?.trim() ? (
          <CustomerInfoField
            label="Observaciones"
            value={customer.observaciones.trim()}
          />
        ) : null}
      </CustomerSectionCard>

      <CustomerSectionCard title="Contacto de referencia" icon={Contact}>
        <AppGrid gap="sm" minItemWidth={140}>
          <CustomerInfoField label="Nombre" value={referenceName} />
          <CustomerInfoField label="Teléfono" value={referencePhone} />
        </AppGrid>

        {referencePhone ? (
          <AppButton
            size="sm"
            variant="ghost"
            tone="primary"
            leadingIcon={ClipboardCopy}
            onPress={() => {
              void onCopyText(referencePhone);
            }}
          >
            Copiar referencia
          </AppButton>
        ) : null}
      </CustomerSectionCard>

      <CustomerSectionCard title="Servicio de internet" icon={Globe}>
        <AppGrid gap="sm" minItemWidth={140}>
          <CustomerInfoField label="Plan" value={customer.servicio?.nombre} />
          <CustomerInfoField
            label="Velocidad"
            value={customer.servicio?.velocidad}
          />
          <CustomerInfoField
            label="Precio mensual"
            value={
              customer.servicio
                ? formatCustomerMoney(customer.servicio.precio)
                : null
            }
          />
          <CustomerInfoField
            label="Instalación"
            value={formatCustomerDate(customer.fechaInstalacion)}
          />
        </AppGrid>
      </CustomerSectionCard>

      <CustomerSectionCard title="Wi-Fi" icon={Wifi}>
        <AppGrid gap="sm" minItemWidth={140}>
          <CustomerInfoField label="SSID" value={customer.ssidRouter} />
          <CustomerInfoField
            label="Contraseña"
            value={customer.contrasenaWifi ? "••••••••" : null}
          />
        </AppGrid>

        <AppInline gap="xs" align="center" wrap>
          {customer.ssidRouter ? (
            <AppButton
              size="sm"
              variant="ghost"
              tone="neutral"
              leadingIcon={ClipboardCopy}
              onPress={() => {
                void onCopyText(customer.ssidRouter ?? "");
              }}
            >
              Copiar SSID
            </AppButton>
          ) : null}

          {customer.contrasenaWifi ? (
            <AppButton
              size="sm"
              variant="ghost"
              tone="primary"
              leadingIcon={ClipboardCopy}
              onPress={() => {
                void onCopyText(customer.contrasenaWifi ?? "");
              }}
            >
              Copiar contraseña
            </AppButton>
          ) : null}
        </AppInline>
      </CustomerSectionCard>

      <CustomerSectionCard title="Reglas de facturación" icon={Receipt}>
        <AppGrid gap="sm" minItemWidth={130}>
          <CustomerInfoField
            label="Zona"
            value={customer.facturacionZona?.nombre}
          />
          <CustomerInfoField
            label="Generación"
            value={
              customer.facturacionZona?.diaGeneracionFactura
                ? `Día ${customer.facturacionZona.diaGeneracionFactura}`
                : null
            }
          />
          <CustomerInfoField
            label="Pago"
            value={
              customer.facturacionZona?.diaPago
                ? `Día ${customer.facturacionZona.diaPago}`
                : null
            }
          />
          <CustomerInfoField
            label="Corte"
            value={
              customer.facturacionZona?.diaCorte
                ? `Día ${customer.facturacionZona.diaCorte}`
                : null
            }
          />
        </AppGrid>
      </CustomerSectionCard>

      <CustomerSectionCard title="Ubicación" icon={MapPin}>
        <AppGrid gap="sm" minItemWidth={140}>
          <CustomerInfoField label="Dirección" value={customer.direccion} />
          <CustomerInfoField label="Sector" value={customer.sector?.nombre} />
          <CustomerInfoField
            label="Municipio"
            value={customer.municipio?.nombre}
          />
          <CustomerInfoField
            label="Departamento"
            value={customer.departamento?.nombre}
          />
        </AppGrid>
      </CustomerSectionCard>

      <CustomerSectionCard title="Configuración de red" icon={Network}>
        <AppGrid gap="sm" minItemWidth={140}>
          <CustomerInfoField label="Dirección IP" value={customer.IP?.direccion} />
          <CustomerInfoField label="Máscara" value={customer.IP?.mascara} />
          <CustomerInfoField label="Gateway" value={customer.IP?.gateway} />
        </AppGrid>
      </CustomerSectionCard>

      <CustomerSectionCard title="Contrato" icon={CalendarDays}>
        <AppGrid gap="sm" minItemWidth={140}>
          <CustomerInfoField
            label="Instalación programada"
            value={formatCustomerDate(
              customer.contratoServicioInternet?.fechaInstalacionProgramada,
            )}
          />
          <CustomerInfoField
            label="Costo instalación"
            value={
              customer.contratoServicioInternet
                ? formatCustomerMoney(
                    customer.contratoServicioInternet.costoInstalacion,
                  )
                : null
            }
          />
          <CustomerInfoField
            label="Fecha de pago"
            value={formatCustomerDate(
              customer.contratoServicioInternet?.fechaPago,
            )}
          />
        </AppGrid>
      </CustomerSectionCard>

      <CustomerSectionCard title="Servicios adicionales" icon={Package}>
        {customer.clienteServicio.length > 0 ? (
          <AppStack gap="xs">
            {customer.clienteServicio.map((item) => (
              <AppCard key={item.id} variant="tonal" radius="md" padding="xs">
                <AppInline gap="sm" align="center" justify="space-between">
                  <AppStack gap="xxs" flex>
                    <AppText variant="bodySmall" weight="semibold">
                      {item.servicio.nombre}
                    </AppText>
                    <AppText variant="caption" tone="secondary">
                      {item.servicio.tipo ||
                        `Desde ${formatCustomerDate(item.fechaContratacion)}`}
                    </AppText>
                  </AppStack>

                  <AppText variant="bodySmall" weight="bold">
                    {formatCustomerMoney(item.servicio.precio)}
                  </AppText>
                </AppInline>
              </AppCard>
            ))}
          </AppStack>
        ) : (
          <AppText variant="bodySmall" tone="secondary">
            No hay servicios adicionales contratados.
          </AppText>
        )}
      </CustomerSectionCard>
    </AppStack>
  );
}
