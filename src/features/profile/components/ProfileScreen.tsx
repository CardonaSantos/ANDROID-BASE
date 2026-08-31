import {
  AppAlert,
  AppBadge,
  AppCard,
  AppInline,
  AppScrollScreen,
  AppStack,
  AppText,
} from "@/design-system";

import { useAuthProfileQuery } from "@/features/auth";

function formatRoleLabel(role: string): string {
  return role.replace(/_/g, " ").trim();
}

export function ProfileScreen() {
  const profileQuery = useAuthProfileQuery();

  if (profileQuery.isPending) {
    return (
      <AppScrollScreen>
        <AppStack gap="lg">
          <AppText variant="headlineSmall" weight="semibold">
            Perfil
          </AppText>

          <AppText tone="muted">Cargando información de la cuenta...</AppText>
        </AppStack>
      </AppScrollScreen>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <AppScrollScreen>
        <AppStack gap="lg">
          <AppText variant="headlineSmall" weight="semibold">
            Perfil
          </AppText>

          <AppAlert tone="danger" title="No se pudo cargar el perfil">
            No fue posible obtener la información de la cuenta autenticada.
          </AppAlert>
        </AppStack>
      </AppScrollScreen>
    );
  }

  const profile = profileQuery.data;

  const roleLabel = formatRoleLabel(profile.rol);

  return (
    <AppScrollScreen>
      <AppStack gap="2xl">
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <AppStack gap="xs">
          <AppInline gap="sm" align="center" wrap>
            <AppText variant="headlineSmall" weight="semibold">
              Perfil
            </AppText>

            <AppBadge
              tone={profile.activo ? "success" : "danger"}
              variant="soft"
              size="sm"
            >
              {profile.activo ? "Activo" : "Inactivo"}
            </AppBadge>
          </AppInline>

          <AppText tone="muted">
            Información de tu cuenta y acceso a NOVA.
          </AppText>
        </AppStack>

        {/* ===================================== */}
        {/* IDENTITY */}
        {/* ===================================== */}

        <AppCard variant="outlined" padding="lg">
          <AppStack gap="lg">
            <AppStack gap="xxs">
              <AppText variant="labelSmall" tone="muted">
                NOMBRE
              </AppText>

              <AppText variant="titleMedium" weight="semibold">
                {profile.nombre}
              </AppText>
            </AppStack>

            <AppStack gap="xxs">
              <AppText variant="labelSmall" tone="muted">
                CORREO ELECTRÓNICO
              </AppText>

              <AppText variant="bodyMedium">{profile.correo}</AppText>
            </AppStack>

            <AppStack gap="xxs">
              <AppText variant="labelSmall" tone="muted">
                ROL
              </AppText>

              <AppText variant="bodyMedium" weight="medium">
                {roleLabel}
              </AppText>
            </AppStack>
          </AppStack>
        </AppCard>

        {/* ===================================== */}
        {/* ACCOUNT */}
        {/* ===================================== */}

        <AppCard variant="tonal" padding="lg">
          <AppStack gap="lg">
            <AppStack gap="xs">
              <AppText variant="titleSmall" weight="semibold">
                Cuenta
              </AppText>

              <AppText variant="bodySmall" tone="muted">
                Información interna asociada a tu sesión.
              </AppText>
            </AppStack>

            <AppInline gap="2xl" wrap>
              <AppStack gap="xxs">
                <AppText variant="labelSmall" tone="muted">
                  ID DE USUARIO
                </AppText>

                <AppText variant="bodyMedium" weight="medium">
                  {profile.id}
                </AppText>
              </AppStack>

              <AppStack gap="xxs">
                <AppText variant="labelSmall" tone="muted">
                  EMPRESA
                </AppText>

                <AppText variant="bodyMedium" weight="medium">
                  {profile.empresaId}
                </AppText>
              </AppStack>
            </AppInline>
          </AppStack>
        </AppCard>

        <AppAlert tone="info" title="Configuración de perfil">
          La edición de datos personales se incorporará cuando integremos el
          contrato de actualización de perfil. Esta pantalla actualmente muestra
          únicamente información confirmada por tu sesión.
        </AppAlert>
      </AppStack>
    </AppScrollScreen>
  );
}
