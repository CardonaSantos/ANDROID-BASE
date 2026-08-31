import { LogOut, UserCog } from "lucide-react-native";

import {
  AppMenu,
  AppPressable,
  AppSnackbar,
  type AppMenuEntry,
} from "@/design-system";

import { useAuthProfileQuery, useLogoutMutation } from "@/features/auth";

import { AppUserAvatar } from "./AppUserAvatar";

export interface AppUserMenuProps {
  /*
   * Lo dejamos como prop porque la
   * navegación pertenece al Shell,
   * no al componente de menú.
   */
  onProfile: () => void;

  /*
   * Todavía auth/profile no expone
   * avatarUrl, pero este contrato queda
   * preparado para cuando exista.
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
        anchor={(controls) => (
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel="Abrir menú de usuario"
            accessibilityState={{
              expanded: controls.isOpen,
            }}
            interaction="subtle"
            haptic={false}
            touchTarget="minimum"
            hitSlopPreset="compact"
            radius="full"
            onPress={controls.toggle}
          >
            <AppUserAvatar name={safeName} avatarUrl={avatarUrl} size="sm" />
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
