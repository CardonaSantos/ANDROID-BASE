import { useEffect, useMemo, useState } from "react";

import { Image, View, type StyleProp, type ViewStyle } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import { AppText } from "@/design-system";

export type AppUserAvatarSize = "sm" | "md" | "lg";

export interface AppUserAvatarProps {
  name?: string | null;

  /*
   * Todavía no viene desde auth/profile,
   * pero dejamos el componente preparado
   * para cuando el backend lo exponga.
   */
  avatarUrl?: string | null;

  size?: AppUserAvatarSize;

  /*
   * Normalmente el avatar estará dentro
   * de un botón accesible que abre el
   * menú de usuario.
   *
   * Por eso no imponemos un label por
   * defecto y evitamos generar dos
   * elementos accesibles superpuestos.
   */
  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;

  testID?: string;
}

const AVATAR_SIZE = {
  sm: 28,

  md: 36,

  lg: 44,
} as const satisfies Record<AppUserAvatarSize, number>;

const AVATAR_TEXT_VARIANT = {
  sm: "labelSmall",

  md: "labelMedium",

  lg: "labelLarge",
} as const;

function getUserInitials(name?: string | null): string {
  if (!name) {
    return "??";
  }

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "??";
  }

  const first = words[0]?.[0] ?? "";

  const second = words[1]?.[0] ?? words[0]?.[1] ?? "";

  return `${first}${second}`.toUpperCase() || "??";
}

export function AppUserAvatar({
  name,
  avatarUrl,
  size = "sm",
  accessibilityLabel,
  style,
  testID,
}: AppUserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  /*
   * Si en algún momento cambia la URL
   * del avatar —por ejemplo después de
   * editar el perfil— permitimos volver
   * a intentar cargar la imagen nueva.
   */
  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  const initials = useMemo(() => getUserInitials(name), [name]);

  const normalizedAvatarUrl = avatarUrl?.trim() || null;

  const shouldShowImage = Boolean(normalizedAvatarUrl) && !imageFailed;

  const resolvedSize = AVATAR_SIZE[size];

  const textVariant = AVATAR_TEXT_VARIANT[size];

  const isAccessible = Boolean(accessibilityLabel);

  return (
    <View
      accessible={isAccessible}
      accessibilityRole={isAccessible ? "image" : undefined}
      accessibilityLabel={accessibilityLabel}
      style={[styles.root(resolvedSize), style]}
      testID={testID}
    >
      {shouldShowImage ? (
        <Image
          source={{
            uri: normalizedAvatarUrl!,
          }}
          resizeMode="cover"
          accessible={false}
          style={styles.image}
          onError={() => {
            setImageFailed(true);
          }}
        />
      ) : (
        <AppText
          variant={textVariant}
          colorToken="onPrimary"
          weight="bold"
          allowFontScaling={false}
          respectBoldText={false}
        >
          {initials}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: (size: number) => ({
    width: size,

    height: size,

    flexShrink: 0,

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",

    borderWidth: 1,

    borderColor: theme.colors.border,

    borderRadius: size / 2,

    backgroundColor: theme.colors.primary,
  }),

  image: {
    width: "100%",

    height: "100%",
  },
}));
