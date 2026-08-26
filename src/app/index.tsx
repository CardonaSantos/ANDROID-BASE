import { useState } from 'react';
import {
  Activity,
  Boxes,
  CheckCircle2,
  Layers3,
  Palette,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react-native';

import {
  AppAccordion,
  AppAlert,
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
  AppCheckbox,
  AppChip,
  AppGrid,
  AppInline,
  AppInput,
  AppListItem,
  AppProgress,
  AppScrollScreen,
  AppSearchInput,
  AppSection,
  AppSectionHeader,
  AppSegmentedControl,
  AppSelect,
  AppSkeleton,
  AppStack,
  AppStat,
  AppSwitch,
  AppText,
  AppToast,
  themeController,
  type ThemePreference,
} from '@/design-system';

const themeOptions = [
  {
    value: 'system',
    label: 'Sistema',
  },
  {
    value: 'light',
    label: 'Claro',
  },
  {
    value: 'dark',
    label: 'Oscuro',
  },
] as const;

const densityOptions = [
  {
    value: 'comfortable',
    label: 'Cómodo',
  },
  {
    value: 'compact',
    label: 'Compacto',
  },
] as const;

const demoRoleOptions = [
  {
    value: 'admin',
    label: 'Administrador',
    description:
      'Acceso completo a la plataforma.',
  },
  {
    value: 'operator',
    label: 'Operador',
    description:
      'Operación diaria y seguimiento.',
  },
  {
    value: 'viewer',
    label: 'Consulta',
    description:
      'Acceso de solo lectura.',
  },
] as const;

type DemoDensity =
  (typeof densityOptions)[number]['value'];

type DemoRole =
  (typeof demoRoleOptions)[number]['value'];

export default function HomeScreen() {
  const [
    themePreference,
    setThemePreference,
  ] = useState<ThemePreference>(
    themeController.getPreference(),
  );

  const [density, setDensity] =
    useState<DemoDensity>(
      'comfortable',
    );

  const [role, setRole] =
    useState<DemoRole | null>(
      'admin',
    );

  const [name, setName] =
    useState('NOVA');

  const [search, setSearch] =
    useState('');

  const [notifications, setNotifications] =
    useState(true);

  const [confirmed, setConfirmed] =
    useState(false);

  const [toastOpen, setToastOpen] =
    useState(false);

  const changeTheme = (
    value: ThemePreference,
  ) => {
    setThemePreference(value);
    themeController.setPreference(
      value,
    );
  };

  return (
    <>
      <AppScrollScreen
        background="background"
        contained
        maxWidth="page"
        safeAreaEdges={[
          'top',
          'left',
          'right',
          'bottom',
        ]}
        contentPaddingVertical="2xl"
        keyboardShouldPersistTaps="handled"
      >
        <AppStack gap="3xl">
          <AppCard
            variant="tonal"
            tone="primary"
            padding="2xl"
          >
            <AppStack gap="xl">
              <AppInline
                gap="md"
                align="center"
                wrap
              >
                <AppAvatar
                  name="NOVA"
                  tone="primary"
                  size="lg"
                />

                <AppStack
                  gap="xs"
                  flex
                >
                  <AppInline
                    gap="sm"
                    align="center"
                    wrap
                  >
                    <AppBadge
                      tone="primary"
                      variant="solid"
                    >
                      NOVA BASE
                    </AppBadge>

                    <AppBadge
                      tone="success"
                      variant="soft"
                      icon={
                        CheckCircle2
                      }
                    >
                      Design System activo
                    </AppBadge>
                  </AppInline>

                  <AppText
                    variant="headlineLarge"
                    weight="bold"
                  >
                    Una base visual, una sola
                    fuente de verdad.
                  </AppText>

                  <AppText
                    variant="bodyLarge"
                    tone="secondary"
                  >
                    Esta portada usa los
                    componentes reutilizables
                    construidos para NOVA.
                    Cambia el tema, interactúa
                    con los controles y valida
                    la base antes de comenzar
                    las features reales.
                  </AppText>
                </AppStack>
              </AppInline>

              <AppInline
                gap="md"
                wrap
              >
                <AppButton
                  leadingIcon={Sparkles}
                  onPress={() => {
                    setToastOpen(true);
                  }}
                >
                  Probar feedback
                </AppButton>

                <AppButton
                  variant="outlined"
                  tone="neutral"
                  leadingIcon={ShieldCheck}
                  onPress={() => {
                    setConfirmed(
                      (current) =>
                        !current,
                    );
                  }}
                >
                  Alternar estado
                </AppButton>
              </AppInline>
            </AppStack>
          </AppCard>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Tema y apariencia"
                description="Todo cambia desde los tokens y el controlador central."
                leading={
                  <AppAvatar
                    fallback={null}
                    tone="primary"
                    size="sm"
                    name="UI"
                  />
                }
                action={
                  <AppBadge
                    tone="info"
                    variant="soft"
                  >
                    system / light / dark
                  </AppBadge>
                }
              />
            }
          >
            <AppCard
              variant="outlined"
              padding="lg"
            >
              <AppStack gap="lg">
                <AppSegmentedControl
                  options={
                    themeOptions
                  }
                  value={
                    themePreference
                  }
                  onValueChange={
                    changeTheme
                  }
                  fullWidth
                  accessibilityLabel="Tema de la aplicación"
                />

                <AppAlert
                  tone="info"
                  density="compact"
                  title="Sin colores hardcodeados"
                >
                  Fondo, superficies, texto,
                  bordes, estados y contraste
                  provienen del tema semántico
                  NOVA.
                </AppAlert>
              </AppStack>
            </AppCard>
          </AppSection>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Resumen visual"
                description="Composiciones responsivas construidas con AppGrid y AppStat."
                leading={
                  <AppAvatar
                    name="ST"
                    tone="info"
                    size="sm"
                  />
                }
              />
            }
          >
            <AppGrid
              gap="lg"
              minItemWidth={210}
            >
              <AppStat
                label="Componentes"
                value="74"
                description="Inventario reusable"
                icon={Boxes}
                tone="primary"
                variant="tonal"
              />

              <AppStat
                label="Tema"
                value={
                  themePreference
                }
                description="Preferencia activa"
                icon={Palette}
                tone="info"
                variant="outlined"
              />

              <AppStat
                label="Estado demo"
                value={
                  confirmed
                    ? 'Listo'
                    : 'Pendiente'
                }
                description="UI reactiva"
                icon={Activity}
                tone={
                  confirmed
                    ? 'success'
                    : 'warning'
                }
                variant="tonal"
              />
            </AppGrid>
          </AppSection>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Acciones y estados"
                description="Variantes semánticas, feedback y selección."
                leading={
                  <AppAvatar
                    name="AC"
                    tone="success"
                    size="sm"
                  />
                }
              />
            }
          >
            <AppCard
              variant="outlined"
              padding="lg"
            >
              <AppStack gap="xl">
                <AppInline
                  gap="md"
                  wrap
                >
                  <AppButton
                    tone="primary"
                    leadingIcon={Zap}
                    onPress={() => {
                      setToastOpen(true);
                    }}
                  >
                    Primaria
                  </AppButton>

                  <AppButton
                    variant="soft"
                    tone="success"
                  >
                    Success
                  </AppButton>

                  <AppButton
                    variant="outlined"
                    tone="warning"
                  >
                    Warning
                  </AppButton>

                  <AppButton
                    variant="ghost"
                    tone="danger"
                  >
                    Danger
                  </AppButton>
                </AppInline>

                <AppInline
                  gap="sm"
                  wrap
                >
                  <AppChip
                    tone="primary"
                    defaultSelected
                  >
                    Seleccionado
                  </AppChip>

                  <AppChip
                    tone="info"
                    leadingIcon={Layers3}
                  >
                    Reutilizable
                  </AppChip>

                  <AppChip
                    tone="success"
                    variant="soft"
                  >
                    Semántico
                  </AppChip>
                </AppInline>

                <AppSegmentedControl
                  options={
                    densityOptions
                  }
                  value={density}
                  onValueChange={
                    setDensity
                  }
                  tone="primary"
                  accessibilityLabel="Densidad de ejemplo"
                />
              </AppStack>
            </AppCard>
          </AppSection>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Formularios"
                description="Controles visuales desacoplados de la validación de negocio."
                leading={
                  <AppAvatar
                    name="FM"
                    tone="warning"
                    size="sm"
                  />
                }
              />
            }
          >
            <AppCard
              variant="outlined"
              padding="lg"
            >
              <AppStack gap="xl">
                <AppInput
                  label="Nombre de ejemplo"
                  value={name}
                  onChangeText={setName}
                  placeholder="Escribe un nombre"
                  description="AppInput puede usarse solo o conectado a React Hook Form."
                />

                <AppSearchInput
                  label="Búsqueda"
                  value={search}
                  onValueChange={
                    setSearch
                  }
                  placeholder="Buscar en NOVA"
                  onSearch={() => {
                    setToastOpen(true);
                  }}
                />

                <AppSelect
                  label="Rol de ejemplo"
                  options={
                    demoRoleOptions
                  }
                  value={role}
                  onValueChange={
                    setRole
                  }
                  placeholder="Selecciona un rol"
                />

                <AppSwitch
                  label="Notificaciones"
                  description="Ejemplo de un control booleano."
                  value={
                    notifications
                  }
                  onValueChange={
                    setNotifications
                  }
                />

                <AppCheckbox
                  label="Confirmar selección"
                  description="Estado controlado desde la página."
                  value={confirmed}
                  onValueChange={
                    setConfirmed
                  }
                />
              </AppStack>
            </AppCard>
          </AppSection>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Feedback y carga"
                description="Estados reutilizables sin lógica de negocio embebida."
                leading={
                  <AppAvatar
                    name="FX"
                    tone="danger"
                    size="sm"
                  />
                }
              />
            }
          >
            <AppGrid
              gap="lg"
              minItemWidth={260}
            >
              <AppCard
                variant="outlined"
                padding="lg"
              >
                <AppStack gap="lg">
                  <AppText
                    variant="titleSmall"
                    weight="semibold"
                  >
                    Progreso
                  </AppText>

                  <AppProgress
                    value={72}
                    showValue
                    tone="primary"
                    accessibilityLabel="Progreso de demostración"
                  />

                  <AppProgress
                    value={42}
                    variant="circular"
                    showValue
                    tone="info"
                    accessibilityLabel="Progreso circular de demostración"
                  />
                </AppStack>
              </AppCard>

              <AppCard
                variant="outlined"
                padding="lg"
              >
                <AppStack gap="md">
                  <AppText
                    variant="titleSmall"
                    weight="semibold"
                  >
                    Skeleton
                  </AppText>

                  <AppSkeleton
                    variant="rect"
                    height={88}
                  />

                  <AppSkeleton
                    variant="text"
                    width="80%"
                  />

                  <AppSkeleton
                    variant="text"
                    width="55%"
                  />
                </AppStack>
              </AppCard>
            </AppGrid>

            <AppAlert
              tone={
                confirmed
                  ? 'success'
                  : 'warning'
              }
              title={
                confirmed
                  ? 'Estado confirmado'
                  : 'Demo en revisión'
              }
            >
              El mismo componente cambia
              semánticamente sin recibir
              códigos hexadecimales ni estilos
              de negocio.
            </AppAlert>
          </AppSection>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Contenido compuesto"
                description="Filas y acordeones para construir pantallas reales."
                leading={
                  <AppAvatar
                    name="UI"
                    tone="neutral"
                    size="sm"
                  />
                }
              />
            }
          >
            <AppCard
              variant="outlined"
              padding="none"
            >
              <AppListItem
                title="Sistema de diseño"
                description="Tokens, temas, movimiento y accesibilidad."
                metadata="Core"
                leading={
                  <AppAvatar
                    name="DS"
                    tone="primary"
                    size="sm"
                  />
                }
                disclosure
                onPress={() => {
                  setToastOpen(true);
                }}
              />

              <AppListItem
                title="Componentes reutilizables"
                description="Forms, overlays, navegación, feedback y colecciones."
                metadata="74"
                leading={
                  <AppAvatar
                    name="UI"
                    tone="info"
                    size="sm"
                  />
                }
                disclosure
                onPress={() => {
                  setToastOpen(true);
                }}
              />
            </AppCard>

            <AppAccordion
              title="¿Qué valida esta página?"
              description="Una comprobación visual de la baseline NOVA."
              tone="primary"
              variant="tonal"
              defaultExpanded
            >
              <AppStack gap="md">
                <AppText
                  variant="bodyMedium"
                  tone="secondary"
                >
                  Valida composición, tipografía,
                  temas, estados, interacción,
                  formularios, feedback y
                  responsive layout usando
                  únicamente nuestra API pública.
                </AppText>

                <AppInline
                  gap="sm"
                  wrap
                >
                  <AppBadge
                    tone="success"
                    variant="soft"
                  >
                    Theme
                  </AppBadge>

                  <AppBadge
                    tone="info"
                    variant="soft"
                  >
                    Responsive
                  </AppBadge>

                  <AppBadge
                    tone="primary"
                    variant="soft"
                  >
                    Accessible
                  </AppBadge>
                </AppInline>
              </AppStack>
            </AppAccordion>
          </AppSection>

          <AppCard
            variant="tonal"
            tone="neutral"
            padding="xl"
          >
            <AppStack
              gap="sm"
              align="center"
            >
              <AppAvatar
                name="NV"
                tone="primary"
                size="lg"
              />

              <AppText
                variant="titleMedium"
                weight="semibold"
                align="center"
              >
                NOVA baseline
              </AppText>

              <AppText
                variant="bodySmall"
                tone="secondary"
                align="center"
              >
                Esta pantalla es temporal. A
                partir de aquí iremos
                sustituyendo la demo por rutas y
                features reales sin rehacer la
                infraestructura visual.
              </AppText>
            </AppStack>
          </AppCard>
        </AppStack>
      </AppScrollScreen>

      <AppToast
        open={toastOpen}
        onOpenChange={
          setToastOpen
        }
        message="Los componentes NOVA están respondiendo correctamente."
        tone="success"
        position="bottom"
      />
    </>
  );
}
