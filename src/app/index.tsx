import {
  useState,
} from 'react';
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

type DemoDensity =
  (typeof densityOptions)[number]['value'];

export default function HomeScreen() {
  const [
    themePreference,
    setThemePreference,
  ] = useState<ThemePreference>(
    themeController.getPreference(),
  );

  const [
    density,
    setDensity,
  ] = useState<DemoDensity>(
    'comfortable',
  );

  const [
    name,
    setName,
  ] = useState('NOVA');

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    notifications,
    setNotifications,
  ] = useState(true);

  const [
    confirmed,
    setConfirmed,
  ] = useState(false);

  const [
    toastOpen,
    setToastOpen,
  ] = useState(false);

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
        gutter="standard"
        contentPaddingVertical="2xl"
        keyboardShouldPersistTaps="handled"
        safeAreaEdges={[
          'top',
          'left',
          'right',
          'bottom',
        ]}
      >
        <AppStack gap="3xl">
          <AppCard
            variant="tonal"
            tone="primary"
            padding="2xl"
          >
            <AppStack gap="xl">
              <AppStack gap="md">
                <AppInline
                  gap="sm"
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
                    Baseline activa
                  </AppBadge>
                </AppInline>

                <AppText
                  variant="headlineLarge"
                  weight="bold"
                >
                  Design System NOVA
                </AppText>

                <AppText
                  variant="bodyLarge"
                  tone="secondary"
                >
                  Una portada temporal para
                  comprobar composición,
                  responsive, temas, formularios,
                  estados y feedback antes de
                  construir las features reales.
                </AppText>
              </AppStack>

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
                title="Tema"
                description="System, light y dark desde una sola configuración."
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
                  title="Tokens semánticos"
                >
                  Esta página no define colores
                  de fondo, texto o estados por
                  su cuenta. Todo proviene del
                  tema NOVA.
                </AppAlert>
              </AppStack>
            </AppCard>
          </AppSection>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Resumen"
                description="Composición responsive con nuestras primitivas."
              />
            }
          >
            <AppGrid
              gap="lg"
              minItemWidth={220}
            >
              <AppStat
                label="Componentes"
                value="74"
                description="Baseline reusable"
                icon={Boxes}
                tone="primary"
                variant="tonal"
              />

              <AppStat
                label="Tema"
                value={
                  themePreference
                }
                description="Preferencia actual"
                icon={Palette}
                tone="info"
                variant="outlined"
              />

              <AppStat
                label="Demo"
                value={
                  confirmed
                    ? 'Lista'
                    : 'Pendiente'
                }
                description="Estado interactivo"
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
                title="Acciones"
                description="Variantes, tonos y selección sin estilos locales."
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
                    leadingIcon={
                      Layers3
                    }
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
                description="Inputs controlados preparados para conectarse después a RHF y Zod."
              />
            }
          >
            <AppCard
              variant="outlined"
              padding="lg"
            >
              <AppStack gap="xl">
                <AppInput
                  label="Nombre"
                  value={name}
                  onChangeText={
                    setName
                  }
                  placeholder="Escribe un nombre"
                  description="Control visual reusable."
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

                <AppSwitch
                  label="Notificaciones"
                  description="Control booleano reusable."
                  value={
                    notifications
                  }
                  onValueChange={
                    setNotifications
                  }
                />

                <AppCheckbox
                  label="Confirmar selección"
                  description="Estado controlado desde la pantalla."
                  value={
                    confirmed
                  }
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
                title="Feedback"
                description="Carga, progreso y estados semánticos."
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
                    accessibilityLabel="Progreso lineal de demostración"
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
              El componente cambia de tono
              semántico sin recibir códigos de
              color desde esta pantalla.
            </AppAlert>
          </AppSection>

          <AppSection
            gap="lg"
            header={
              <AppSectionHeader
                title="Contenido compuesto"
                description="Bloques que después podremos usar dentro de features reales."
              />
            }
          >
            <AppCard
              variant="outlined"
              padding="none"
            >
              <AppListItem
                title="Sistema de diseño"
                description="Theme, tokens, motion y accesibilidad."
                metadata="Core"
                disclosure
                onPress={() => {
                  setToastOpen(true);
                }}
              />

              <AppListItem
                title="Componentes reutilizables"
                description="Forms, overlays, feedback, navegación y colecciones."
                metadata="74"
                disclosure
                onPress={() => {
                  setToastOpen(true);
                }}
              />
            </AppCard>

            <AppAccordion
              title="¿Qué demuestra esta página?"
              description="Una comprobación visual, no una feature de negocio."
              tone="primary"
              variant="tonal"
              defaultExpanded
            >
              <AppStack gap="md">
                <AppText
                  variant="bodyMedium"
                  tone="secondary"
                >
                  Cuando empecemos auth,
                  clientes, tickets o e-shop,
                  reutilizaremos estas mismas
                  piezas sin volver a resolver
                  layout, theme y estados desde
                  cero.
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
        </AppStack>
      </AppScrollScreen>

      <AppToast
        open={toastOpen}
        onOpenChange={
          setToastOpen
        }
        message="NOVA Design System está respondiendo correctamente."
        tone="success"
        position="bottom"
      />
    </>
  );
}
