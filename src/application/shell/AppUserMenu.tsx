import { LogOut, UserCog } from "lucide-react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppMenu,
  AppPressable,
  AppSnackbar,
  type AppMenuEntry,
} from "@/design-system";

import { useAuthProfileQuery, useLogoutMutation } from "@/features/auth";

import { AppUserAvatar } from "./AppUserAvatar";

export interface AppUserMenuProps {
  onProfile: () => void;

  /*
   * Se conserva temporalmente como fallback
   * para no romper los consumidores actuales.
   *
   * La fuente principal desde ahora es:
   * authProfile.avatarUrl
   */
  avatarUrl?: string | null;
}

function formatRoleLabel(role?: string | null): string | null {
  if (!role) {
    return null;
  }

  return role.replace(/_/g, " ").trim();
}

export function AppUserMenu({ onProfile, avatarUrl }: AppUserMenuProps) {
  const profileQuery = useAuthProfileQuery();

  const logoutMutation = useLogoutMutation();

  const profile = profileQuery.data;

  const safeName = profile?.nombre ?? "Usuario";

  const safeEmail = profile?.correo ?? "Cuenta autenticada";

  const roleLabel = formatRoleLabel(profile?.rol);

  /*
   * El avatar del usuario autenticado
   * viene ahora directamente de:
   *
   * POST /auth/login-user
   * GET  /auth/profile
   *
   * Ambos usan el mismo AuthUser.
   */
  const resolvedAvatarUrl = profile?.avatarUrl ?? avatarUrl ?? null;

  const profileDescription = roleLabel
    ? `${safeEmail} · ${roleLabel}`
    : safeEmail;

  const items: readonly AppMenuEntry[] = [
    {
      id: "profile",

      label: safeName,

      description: profileDescription,

      icon: UserCog,

      disabled: profileQuery.isPending,

      onPress: onProfile,
    },

    {
      type: "separator",

      id: "profile-logout-separator",
    },

    {
      id: "logout",

      label: logoutMutation.isPending ? "Cerrando sesión..." : "Cerrar sesión",

      description: "Salir de esta cuenta",

      icon: LogOut,

      tone: "danger",

      disabled: logoutMutation.isPending,

      onPress: () => {
        logoutMutation.mutate();
      },
    },
  ];

  return (
    <>
      <AppMenu
        items={items}
        anchorPosition="bottom"
        overlayAccessibilityLabel="Cerrar menú de usuario"
        contentStyle={styles.menuContent}
        anchor={(controls) => (
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel="Abrir menú de usuario"
            accessibilityState={{
              expanded: controls.isOpen,
            }}
            touchTarget="none"
            hitSlopPreset="normal"
            interaction="subtle"
            haptic={false}
            radius="full"
            style={styles.avatarButton}
            onPress={controls.toggle}
          >
            <AppUserAvatar
              name={safeName}
              avatarUrl={resolvedAvatarUrl}
              size="sm"
            />
          </AppPressable>
        )}
      />

      <AppSnackbar
        open={logoutMutation.isError}
        onOpenChange={(open) => {
          if (!open) {
            logoutMutation.reset();
          }
        }}
        message="No se pudo cerrar la sesión. Verifica que no haya operaciones pendientes e inténtalo nuevamente."
        tone="danger"
        position="bottom"
      />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  avatarButton: {
    width: 36,

    height: 36,

    flexShrink: 0,

    alignItems: "center",

    justifyContent: "center",
  },

  /*
   * Paper posiciona el menú respecto
   * al anchor.
   *
   * Añadimos espacio visual únicamente
   * al menú de usuario para evitar que
   * parezca pegado al toolbar.
   */
  menuContent: {
    marginTop: theme.spacing.sm,
  },
}));
