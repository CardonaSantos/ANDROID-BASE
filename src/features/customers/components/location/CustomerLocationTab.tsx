import { ExternalLink, MapPin, Navigation } from "lucide-react-native";
import { useState } from "react";
import { Linking } from "react-native";

import {
  AppButton,
  AppGrid,
  AppInline,
  AppSnackbar,
  AppStack,
  AppText,
} from "@/design-system";

import type { CustomerProfile } from "../../api/customers.contracts.api";
import {
  buildCustomerMapsDirectionsUrl,
  buildCustomerMapsSearchUrl,
  getCustomerFullName,
} from "../../customers.helpers";
import { CustomerInfoField } from "../shared/CustomerInfoField";
import { CustomerSectionCard } from "../shared/CustomerSectionCard";
import { CustomerLocationMap } from "./CustomerLocationMap";

export interface CustomerLocationTabProps {
  customer: CustomerProfile;
}

export function CustomerLocationTab({ customer }: CustomerLocationTabProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const location = customer.ubicacion;

  const openUrl = async (url: string, failureMessage: string) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        setFeedback(failureMessage);
        return;
      }

      await Linking.openURL(url);
    } catch {
      setFeedback(failureMessage);
    }
  };

  return (
    <>
      <AppStack gap="sm">
        <CustomerSectionCard title="Dirección" icon={MapPin}>
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

          {location ? (
            <AppInline gap="xs" align="center" wrap>
              <AppButton
                size="sm"
                variant="soft"
                tone="primary"
                leadingIcon={ExternalLink}
                onPress={() => {
                  void openUrl(
                    buildCustomerMapsSearchUrl(
                      location.latitud,
                      location.longitud,
                    ),
                    "No se pudo abrir la ubicación.",
                  );
                }}
              >
                Ver en Maps
              </AppButton>

              <AppButton
                size="sm"
                variant="outlined"
                tone="neutral"
                leadingIcon={Navigation}
                onPress={() => {
                  void openUrl(
                    buildCustomerMapsDirectionsUrl(
                      location.latitud,
                      location.longitud,
                    ),
                    "No se pudo iniciar la ruta.",
                  );
                }}
              >
                Iniciar ruta
              </AppButton>
            </AppInline>
          ) : null}
        </CustomerSectionCard>

        {location ? (
          <CustomerSectionCard title="Mapa" icon={Navigation}>
            <CustomerLocationMap
              location={location}
              title={getCustomerFullName(customer) || `Cliente #${customer.id}`}
            />

            <AppText variant="caption" tone="secondary">
              {location.latitud}, {location.longitud}
            </AppText>
          </CustomerSectionCard>
        ) : (
          <CustomerSectionCard title="Mapa" icon={Navigation}>
            <AppText variant="bodySmall" tone="secondary">
              Este cliente todavía no tiene coordenadas registradas.
            </AppText>
          </CustomerSectionCard>
        )}
      </AppStack>

      <AppSnackbar
        open={feedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFeedback(null);
          }
        }}
        message={feedback ?? ""}
        tone="danger"
        position="bottom"
      />
    </>
  );
}
