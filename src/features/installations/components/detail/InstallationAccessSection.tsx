import {
  Activity,
  Globe,
  KeyRound,
  Network,
  Router,
  Wifi,
} from "lucide-react-native";

import {
  AppBadge,
  AppCard,
  AppDivider,
  AppGrid,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  InstallationTechnicalAccess,
  InstallationTechnicalDetail,
} from "../../api/installations.contracts.api";

import {
  formatEnumLabel,
  formatInstallationDate,
} from "../../installations.helpers";

export interface InstallationAccessSectionProps {
  installation: InstallationTechnicalDetail;
}

/*
 * =========================================================
 * SMALL VALUE
 * =========================================================
 */

interface TechnicalValueProps {
  label: string;

  value: string | number | null | undefined;
}

function TechnicalValue({ label, value }: TechnicalValueProps) {
  const hasValue =
    value !== null && value !== undefined && String(value).trim().length > 0;

  return (
    <AppStack gap="xs">
      <AppText variant="bodySmall" tone="secondary" weight="medium">
        {label}
      </AppText>

      <AppText
        variant="bodyMedium"
        weight={hasValue ? "medium" : "regular"}
        tone={hasValue ? "default" : "secondary"}
      >
        {hasValue ? String(value) : "Sin dato"}
      </AppText>
    </AppStack>
  );
}

/*
 * =========================================================
 * ACCESS CARD
 * =========================================================
 */

interface AccessCardProps {
  access: InstallationTechnicalAccess;
}

function AccessCard({ access }: AccessCardProps) {
  const configuration = access.configuracionTecnica;

  const pppoe = access.cuentaPppoe;

  return (
    <AppCard variant="tonal" radius="md" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            ACCESS HEADER
           =============================================== */}

        <AppInline gap="sm" align="center" justify="space-between" wrap>
          <AppInline gap="sm" align="center" flex>
            <AppIcon icon={Network} size="sm" tone="primary" decorative />

            <AppStack gap="xs" flex>
              <AppText variant="bodySmall" tone="secondary">
                {`Acceso #${access.id}`}
              </AppText>

              <AppText variant="titleMedium" weight="semibold">
                {formatEnumLabel(access.tecnologia)}
              </AppText>
            </AppStack>
          </AppInline>

          <AppBadge
            size="sm"
            tone="neutral"
            variant="soft"
            accessibilityLabel={`Estado del acceso: ${formatEnumLabel(
              access.estado,
            )}`}
          >
            {formatEnumLabel(access.estado)}
          </AppBadge>
        </AppInline>

        {/* ===============================================
            ACCESS GENERAL DATA
           =============================================== */}

        <AppGrid gap="md" minItemWidth={140}>
          <TechnicalValue
            label="Autenticación"
            value={formatEnumLabel(access.metodoAutenticacion)}
          />

          <TechnicalValue
            label="Acción"
            value={formatEnumLabel(access.accion)}
          />

          <TechnicalValue label="Vínculo" value={`#${access.vinculoId}`} />

          <TechnicalValue
            label="Servicio ID"
            value={
              access.servicioInternetId ? `#${access.servicioInternetId}` : null
            }
          />
        </AppGrid>

        {/* ===============================================
            TECHNICAL CONFIGURATION
           =============================================== */}

        {configuration ? (
          <>
            <AppDivider />

            <AppInline gap="sm" align="center">
              <AppIcon icon={Activity} size="sm" tone="primary" decorative />

              <AppText variant="bodyMedium" weight="semibold">
                Configuración técnica
              </AppText>
            </AppInline>

            <AppGrid gap="md" minItemWidth={140}>
              <TechnicalValue
                label="Potencia óptica RX"
                value={
                  configuration.potenciaOpticaRxDbm !== null
                    ? `${configuration.potenciaOpticaRxDbm} dBm`
                    : null
                }
              />

              <TechnicalValue
                label="Señal inalámbrica"
                value={
                  configuration.senalInalambricaDbm !== null
                    ? `${configuration.senalInalambricaDbm} dBm`
                    : null
                }
              />

              <TechnicalValue label="SSID" value={configuration.ssid} />

              <TechnicalValue
                label="Seguridad WiFi"
                value={
                  configuration.tieneContrasenaWifi
                    ? "Con contraseña"
                    : "Sin contraseña"
                }
              />

              <TechnicalValue label="Banda" value={configuration.bandaWifi} />

              <TechnicalValue label="Canal" value={configuration.canal} />

              <TechnicalValue
                label="Ancho de canal"
                value={
                  configuration.anchoCanalMhz !== null
                    ? `${configuration.anchoCanalMhz} MHz`
                    : null
                }
              />
            </AppGrid>

            {/* ===========================================
                NETWORK
               =========================================== */}

            <AppCard variant="outlined" radius="md" padding="sm">
              <AppStack gap="md">
                <AppInline gap="sm" align="center">
                  <AppIcon icon={Globe} size="sm" tone="muted" decorative />

                  <AppText variant="bodyMedium" weight="semibold">
                    Red
                  </AppText>
                </AppInline>

                <AppGrid gap="md" minItemWidth={140}>
                  <TechnicalValue label="IPv4" value={configuration.red.ipv4} />

                  <TechnicalValue label="IPv6" value={configuration.red.ipv6} />

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
                </AppGrid>
              </AppStack>
            </AppCard>

            {configuration.observaciones ? (
              <AppStack gap="xs">
                <AppText variant="bodySmall" tone="secondary" weight="medium">
                  Observaciones técnicas
                </AppText>

                <AppText variant="bodyMedium">
                  {configuration.observaciones}
                </AppText>
              </AppStack>
            ) : null}
          </>
        ) : (
          <>
            <AppDivider />

            <AppText variant="bodySmall" tone="secondary">
              Este acceso todavía no tiene configuración técnica registrada.
            </AppText>
          </>
        )}

        {/* ===============================================
            PPPOE
           =============================================== */}

        {pppoe ? (
          <>
            <AppDivider />

            <AppCard variant="outlined" radius="md" padding="md">
              <AppStack gap="md">
                <AppInline gap="sm" align="center" justify="space-between" wrap>
                  <AppInline gap="sm" align="center" flex>
                    <AppIcon
                      icon={KeyRound}
                      size="sm"
                      tone="primary"
                      decorative
                    />

                    <AppStack gap="xs" flex>
                      <AppText variant="bodySmall" tone="secondary">
                        Cuenta PPPoE
                      </AppText>

                      <AppText variant="bodyMedium" weight="semibold">
                        {pppoe.usuario}
                      </AppText>
                    </AppStack>
                  </AppInline>

                  <AppBadge size="sm" tone="neutral" variant="soft">
                    {formatEnumLabel(pppoe.estado)}
                  </AppBadge>
                </AppInline>

                <AppGrid gap="md" minItemWidth={150}>
                  <TechnicalValue label="Perfil" value={pppoe.codigoPerfil} />

                  <TechnicalValue
                    label="Perfil ID"
                    value={`#${pppoe.perfilHomologacionId}`}
                  />

                  <TechnicalValue label="Router" value={pppoe.routerNombre} />

                  <TechnicalValue
                    label="Router ID"
                    value={`#${pppoe.mikrotikRouterId}`}
                  />
                </AppGrid>

                <AppGrid gap="md" minItemWidth={180}>
                  <TechnicalValue
                    label="Generada"
                    value={formatInstallationDate(pppoe.generadoEn)}
                  />

                  <TechnicalValue
                    label="Activada"
                    value={
                      pppoe.activadoEn
                        ? formatInstallationDate(pppoe.activadoEn)
                        : null
                    }
                  />

                  <TechnicalValue
                    label="Última sincronización"
                    value={
                      pppoe.ultimaSincronizacionEn
                        ? formatInstallationDate(pppoe.ultimaSincronizacionEn)
                        : null
                    }
                  />
                </AppGrid>

                {pppoe.ultimoError ? (
                  <AppCard variant="tonal" radius="md" padding="sm">
                    <AppStack gap="xs">
                      <AppText
                        variant="bodySmall"
                        tone="danger"
                        weight="semibold"
                      >
                        Último error PPPoE
                      </AppText>

                      <AppText variant="bodySmall">{pppoe.ultimoError}</AppText>
                    </AppStack>
                  </AppCard>
                ) : null}
              </AppStack>
            </AppCard>
          </>
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

export function InstallationAccessSection({
  installation,
}: InstallationAccessSectionProps) {
  const accesses = installation.accesos;

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        {/* ===============================================
            HEADER
           =============================================== */}

        <AppInline gap="sm" align="center">
          <AppIcon icon={Router} size="md" tone="primary" decorative />

          <AppStack gap="xs" flex>
            <AppText variant="titleMedium" weight="semibold">
              Acceso y red
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              Configuración técnica y acceso asociado al servicio.
            </AppText>
          </AppStack>

          {accesses.length > 0 ? (
            <AppBadge
              icon={Wifi}
              size="sm"
              tone="info"
              variant="soft"
              accessibilityLabel={`${accesses.length} accesos registrados`}
            >
              {`${accesses.length}`}
            </AppBadge>
          ) : null}
        </AppInline>

        {/* ===============================================
            ACCESSES
           =============================================== */}

        {accesses.length === 0 ? (
          <AppCard variant="tonal" radius="md" padding="md">
            <AppText variant="bodyMedium" tone="secondary">
              Esta instalación todavía no tiene accesos de internet asociados.
            </AppText>
          </AppCard>
        ) : (
          <AppStack gap="md">
            {accesses.map((access) => (
              <AccessCard key={access.vinculoId} access={access} />
            ))}
          </AppStack>
        )}
      </AppStack>
    </AppCard>
  );
}
