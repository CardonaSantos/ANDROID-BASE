import {
  Activity,
  Eye,
  Globe,
  KeyRound,
  Network,
  Router,
  Server,
} from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type {
  InstallationTechnicalAccess,
  InstallationTechnicalDetail,
} from "../../api/installations.contracts.api";

import {
  formatEnumLabel,
  formatInstallationDate,
} from "../../installations.helpers";

import { RevealPppoeCredentialsDialog } from "../actions/RevealPppoeCredentialsDialog";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppDivider,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

export interface InstallationAccessSectionProps {
  installation: InstallationTechnicalDetail;
}

interface TechnicalValueProps {
  label: string;

  value: string | number | null | undefined;

  tone?: "primary" | "secondary";
}

function TechnicalValue({
  label,
  value,
  tone = "secondary",
}: TechnicalValueProps) {
  const hasValue =
    value !== null && value !== undefined && String(value).trim().length > 0;

  return (
    <View style={styles.valueItem}>
      <AppText variant="labelSmall" tone="default">
        {label}
      </AppText>

      <AppText variant="bodySmall" tone={hasValue ? tone : "default"}>
        {hasValue ? String(value) : "Sin dato"}
      </AppText>
    </View>
  );
}

function formatWifiSecurity(hasPassword: boolean | null | undefined) {
  if (hasPassword === null || hasPassword === undefined) {
    return null;
  }

  return hasPassword ? "Con contraseña" : "Sin contraseña";
}

function formatEntityId(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return `#${value}`;
}

function InstallationAccessCard({
  access,
}: {
  access: InstallationTechnicalAccess;
}) {
  const configuration = access.configuracionTecnica;

  const pppoe = access.cuentaPppoe;

  return (
    <AppCard variant="tonal" radius="lg" padding="md">
      <AppStack gap="md">
        <AppInline align="center" justify="space-between" gap="sm" wrap>
          <AppInline align="center" gap="sm" flex>
            <AppIcon
              icon={Router}
              size="sm"
              tone="primary"
              accessibilityLabel="Acceso de red"
            />

            <AppStack gap="xs" flex>
              <AppText variant="titleSmall">Acceso #{access.id}</AppText>

              <AppText variant="bodySmall" tone="secondary">
                {formatEnumLabel(access.tecnologia)}
              </AppText>
            </AppStack>
          </AppInline>

          <AppBadge tone="info" variant="soft" size="sm">
            {formatEnumLabel(access.estado)}
          </AppBadge>
        </AppInline>

        <View style={styles.valueGrid}>
          <TechnicalValue
            label="Autenticación"
            value={formatEnumLabel(access.metodoAutenticacion)}
          />

          <TechnicalValue
            label="Acción"
            value={formatEnumLabel(access.accion)}
          />

          <TechnicalValue
            label="Vínculo"
            value={formatEntityId(access.vinculoId)}
          />

          <TechnicalValue
            label="Servicio"
            value={formatEntityId(access.servicioInternetId)}
          />
        </View>

        {configuration ? (
          <>
            <AppDivider />

            <AppStack gap="md">
              <AppInline align="center" gap="sm">
                <AppIcon
                  icon={Activity}
                  size="sm"
                  tone="primary"
                  accessibilityLabel="Configuración técnica"
                />

                <AppStack gap="xs" flex>
                  <AppText variant="titleSmall">Configuración técnica</AppText>

                  <AppText variant="bodySmall" tone="secondary">
                    Parámetros registrados durante la instalación.
                  </AppText>
                </AppStack>
              </AppInline>

              <View style={styles.valueGrid}>
                <TechnicalValue
                  label="Potencia óptica RX"
                  value={
                    configuration.potenciaOpticaRxDbm !== null &&
                    configuration.potenciaOpticaRxDbm !== undefined
                      ? `${configuration.potenciaOpticaRxDbm} dBm`
                      : null
                  }
                />

                <TechnicalValue
                  label="Señal inalámbrica"
                  value={
                    configuration.senalInalambricaDbm !== null &&
                    configuration.senalInalambricaDbm !== undefined
                      ? `${configuration.senalInalambricaDbm} dBm`
                      : null
                  }
                />

                <TechnicalValue label="SSID" value={configuration.ssid} />

                <TechnicalValue
                  label="Seguridad Wi-Fi"
                  value={formatWifiSecurity(configuration.tieneContrasenaWifi)}
                />

                <TechnicalValue label="Banda" value={configuration.bandaWifi} />

                <TechnicalValue label="Canal" value={configuration.canal} />

                <TechnicalValue
                  label="Ancho de canal"
                  value={
                    configuration.anchoCanalMhz !== null &&
                    configuration.anchoCanalMhz !== undefined
                      ? `${configuration.anchoCanalMhz} MHz`
                      : null
                  }
                />
              </View>

              <AppCard variant="outlined" radius="md" padding="sm">
                <AppStack gap="sm">
                  <AppInline align="center" gap="sm">
                    <AppIcon
                      icon={Network}
                      size="sm"
                      tone="secondary"
                      accessibilityLabel="Red"
                    />

                    <AppText variant="labelMedium">Red</AppText>
                  </AppInline>

                  <View style={styles.valueGrid}>
                    <TechnicalValue
                      label="IPv4"
                      value={configuration.red.ipv4}
                    />

                    <TechnicalValue
                      label="IPv6"
                      value={configuration.red.ipv6}
                    />

                    <TechnicalValue
                      label="Gateway"
                      value={configuration.red.gateway}
                    />

                    <TechnicalValue
                      label="DNS primario"
                      value={configuration.red.dnsPrimario}
                    />

                    <TechnicalValue
                      label="DNS secundario"
                      value={configuration.red.dnsSecundario}
                    />
                  </View>
                </AppStack>
              </AppCard>

              {configuration.observaciones ? (
                <AppText variant="bodySmall" tone="secondary">
                  {configuration.observaciones}
                </AppText>
              ) : null}
            </AppStack>
          </>
        ) : null}

        {pppoe ? (
          <>
            <AppDivider />

            <AppStack gap="md">
              <AppInline align="center" gap="sm">
                <AppIcon
                  icon={KeyRound}
                  size="sm"
                  tone="warning"
                  accessibilityLabel="Cuenta PPPoE"
                />

                <AppStack gap="xs" flex>
                  <AppText variant="titleSmall">Cuenta PPPoE</AppText>

                  <AppText variant="bodySmall" tone="secondary">
                    Información operativa de autenticación y sincronización.
                  </AppText>
                </AppStack>
              </AppInline>

              <View style={styles.valueGrid}>
                <TechnicalValue label="Usuario" value={pppoe.usuario} />

                <TechnicalValue
                  label="Estado"
                  value={formatEnumLabel(pppoe.estado)}
                />

                <TechnicalValue label="Perfil" value={pppoe.codigoPerfil} />

                <TechnicalValue
                  label="Perfil homologado"
                  value={formatEntityId(pppoe.perfilHomologacionId)}
                />

                <TechnicalValue label="Router" value={pppoe.routerNombre} />

                <TechnicalValue
                  label="MikroTik"
                  value={formatEntityId(pppoe.mikrotikRouterId)}
                />

                <TechnicalValue
                  label="Generada"
                  value={formatInstallationDate(pppoe.generadoEn)}
                />

                <TechnicalValue
                  label="Activada"
                  value={formatInstallationDate(pppoe.activadoEn)}
                />

                <TechnicalValue
                  label="Última sincronización"
                  value={formatInstallationDate(pppoe.ultimaSincronizacionEn)}
                />
              </View>

              {pppoe.ultimoError ? (
                <AppCard variant="outlined" radius="md" padding="sm">
                  <AppStack gap="xs">
                    <AppText variant="labelSmall" tone="danger">
                      Último error
                    </AppText>

                    <AppText variant="bodySmall" tone="secondary">
                      {pppoe.ultimoError}
                    </AppText>
                  </AppStack>
                </AppCard>
              ) : null}
            </AppStack>
          </>
        ) : null}
      </AppStack>
    </AppCard>
  );
}

export function InstallationAccessSection({
  installation,
}: InstallationAccessSectionProps) {
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);

  const hasPppoe = installation.accesos.some(
    (access) => access.cuentaPppoe !== null,
  );

  /*
   * Autoridad única:
   *
   * el servidor decide si esta acción puede ejecutarse.
   *
   * No inferimos permisos mediante:
   *
   * - estado de instalación;
   * - estado PPPoE;
   * - rol local;
   * - presencia de router;
   * - ningún state machine del frontend.
   */
  const revealAction = installation.acciones.revelarCredenciales;

  if (installation.accesos.length === 0) {
    return (
      <AppCard variant="outlined" radius="lg" padding="md">
        <AppStack align="center" gap="sm">
          <AppIcon
            icon={Globe}
            size="lg"
            tone="default"
            accessibilityLabel="Sin accesos técnicos"
          />

          <AppText variant="titleSmall">Sin accesos técnicos</AppText>

          <AppText variant="bodySmall" tone="secondary" align="center">
            Esta instalación todavía no tiene accesos de red vinculados.
          </AppText>
        </AppStack>
      </AppCard>
    );
  }

  return (
    <>
      <AppCard variant="outlined" radius="lg" padding="md">
        <AppStack gap="md">
          <AppInline align="center" gap="sm">
            <AppIcon
              icon={Server}
              size="sm"
              tone="primary"
              accessibilityLabel="Accesos técnicos"
            />

            <AppStack gap="xs" flex>
              <AppText variant="titleSmall">Accesos y red</AppText>

              <AppText variant="bodySmall" tone="secondary">
                Configuración técnica.
              </AppText>
            </AppStack>
          </AppInline>

          <AppStack gap="md">
            {installation.accesos.map((access) => (
              <InstallationAccessCard key={access.vinculoId} access={access} />
            ))}
          </AppStack>

          {hasPppoe ? (
            <>
              <AppDivider />

              <AppCard variant="tonal" radius="lg" padding="md">
                <AppStack gap="md">
                  <AppInline align="center" gap="sm">
                    <AppIcon
                      icon={KeyRound}
                      size="sm"
                      tone="warning"
                      accessibilityLabel="Credenciales PPPoE"
                    />

                    <AppStack gap="xs" flex>
                      <AppText variant="titleSmall">Credenciales PPPoE</AppText>

                      <AppText variant="bodySmall" tone="secondary">
                        Consulta protegida de usuario y contraseña para trabajo
                        técnico.
                      </AppText>
                    </AppStack>
                  </AppInline>

                  <AppButton
                    variant="outlined"
                    tone="warning"
                    leadingIcon={Eye}
                    disabled={!revealAction.habilitada}
                    onPress={() => {
                      if (!revealAction.habilitada) {
                        return;
                      }

                      setCredentialsDialogOpen(true);
                    }}
                  >
                    Revelar credenciales
                  </AppButton>

                  {!revealAction.habilitada ? (
                    <AppText variant="bodySmall" tone="default">
                      {revealAction.motivo?.trim() ||
                        "El servidor no permite revelar las credenciales en este momento."}
                    </AppText>
                  ) : null}
                </AppStack>
              </AppCard>
            </>
          ) : null}
        </AppStack>
      </AppCard>

      {hasPppoe ? (
        <RevealPppoeCredentialsDialog
          open={credentialsDialogOpen}
          installationId={installation.id}
          canReveal={revealAction.habilitada}
          disabledReason={revealAction.motivo}
          onOpenChange={setCredentialsDialogOpen}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  valueGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: theme.spacing.md,
  },

  valueItem: {
    flexGrow: 1,

    flexBasis: 140,

    gap: theme.spacing.xs,
  },
}));
