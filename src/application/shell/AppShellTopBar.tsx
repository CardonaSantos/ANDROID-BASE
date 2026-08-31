import { Menu } from "lucide-react-native";

import { StyleSheet } from "react-native-unistyles";

import { AppIcon, AppPressable, AppTopBar } from "@/design-system";

import { AppUserMenu } from "./AppUserMenu";

export interface AppShellTopBarProps {
  title: string;

  subtitle?: string;

  showMenuButton?: boolean;

  onMenuPress?: () => void;

  onProfile: () => void;

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
            /*
             * Igual que el avatar:
             *
             * - 36 px visuales
             * - hitSlop externo para mantener
             *   un área táctil accesible
             * - hover/focus exactamente
             *   centrados sobre el icono
             */
            touchTarget="none"
            hitSlopPreset="normal"
            interaction="subtle"
            haptic="selection"
            radius="full"
            style={styles.menuButton}
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

const styles = StyleSheet.create(() => ({
  menuButton: {
    width: 36,

    height: 36,

    flexShrink: 0,

    alignItems: "center",

    justifyContent: "center",
  },
}));
