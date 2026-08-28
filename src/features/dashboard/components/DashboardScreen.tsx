import { LogOut } from "lucide-react-native";

import { useRouter } from "expo-router";

import { useCurrentUserQuery } from "@/core/access";

import {
  AppAlert,
  AppButton,
  AppGrid,
  AppScrollScreen,
  AppStack,
  AppText,
} from "@/design-system";

import { useLogoutMutation } from "@/features/auth";

import { dashboardModules } from "../dashboard.modules";

import { DashboardModuleCard } from "./DashboardModuleCard";

export function DashboardScreen() {
  const router = useRouter();

  const currentUserQuery = useCurrentUserQuery();

  const logoutMutation = useLogoutMutation();

  if (currentUserQuery.isPending) {
    return (
      <AppScrollScreen>
        <AppText>Cargando...</AppText>
      </AppScrollScreen>
    );
  }

  if (currentUserQuery.isError || !currentUserQuery.data) {
    return (
      <AppScrollScreen>
        <AppAlert tone="danger" title="No se pudo cargar el usuario">
          No fue posible obtener la información de la sesión.
        </AppAlert>
      </AppScrollScreen>
    );
  }

  const user = currentUserQuery.data;

  const availableModules = dashboardModules.filter((module) =>
    module.roles.some((role) => user.roles.includes(role)),
  );

  return (
    <AppScrollScreen>
      <AppStack gap="2xl">
        <AppStack gap="sm">
          <AppText variant="headlineSmall" weight="semibold">
            Panel de trabajo
          </AppText>

          <AppText tone="muted">Rol: {user.roles.join(", ")}</AppText>
        </AppStack>

        <AppStack gap="lg">
          <AppText variant="titleMedium" weight="semibold">
            Módulos
          </AppText>

          {availableModules.length > 0 ? (
            <AppGrid minItemWidth={240} gap="lg">
              {availableModules.map((module) => (
                <DashboardModuleCard
                  key={module.key}
                  module={module}
                  onPress={() => {
                    router.push(module.href);
                  }}
                />
              ))}
            </AppGrid>
          ) : (
            <AppAlert tone="neutral" title="Sin módulos disponibles">
              Tu rol no tiene módulos asignados en esta aplicación.
            </AppAlert>
          )}
        </AppStack>

        <AppButton
          variant="outlined"
          tone="neutral"
          leadingIcon={LogOut}
          loading={logoutMutation.isPending}
          onPress={() => {
            logoutMutation.mutate();
          }}
        >
          Cerrar sesión
        </AppButton>
      </AppStack>
    </AppScrollScreen>
  );
}
