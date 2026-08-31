import { Menu } from "lucide-react-native";

import { AppIcon, AppPressable, AppTopBar } from "@/design-system";

import { AppUserMenu } from "./AppUserMenu";

export interface AppShellTopBarProps {
  /*
   * Nombre de la sección actual:
   *
   * Dashboard
   * Jornada
   * Tickets
   * Instalaciones
   */
  title: string;

  /*
   * Texto opcional debajo del título.
   *
   * No lo hacemos obligatorio porque
   * algunas pantallas de detalle pueden
   * necesitar únicamente el título.
   */
  subtitle?: string;

  /*
   * En móvil el sidebar será un Drawer y
   * mostraremos el trigger.
   *
   * En Web/tablet con sidebar persistente
   * este botón puede ocultarse.
   */
  showMenuButton?: boolean;

  onMenuPress?: () => void;

  /*
   * El menú del usuario delega la
   * navegación al perfil al Shell.
   */
  onProfile: () => void;

  /*
   * Preparado para cuando auth/profile
   * exponga la fotografía.
   */
  avatarUrl?: string | null;
}

export function AppShellTopBar({
  title,
  subtitle,
  showMenuButton = false,
  onMenuPress,
  onProfile,
  avatarUrl,
}: AppShellTopBarProps) {
  const canOpenMenu = showMenuButton && Boolean(onMenuPress);

  return (
    <AppTopBar
      title={title}
      subtitle={subtitle}
      variant="surface"
      divider
      leading={
        showMenuButton ? (
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel="Abrir menú de navegación"
            disabled={!canOpenMenu}
            interaction="subtle"
            haptic="selection"
            touchTarget="minimum"
            hitSlopPreset="compact"
            radius="full"
            onPress={onMenuPress}
          >
            <AppIcon icon={Menu} size="md" tone="default" decorative />
          </AppPressable>
        ) : null
      }
      actions={<AppUserMenu onProfile={onProfile} avatarUrl={avatarUrl} />}
    />
  );
}
