import { ArrowLeft } from "lucide-react-native";

import { useRouter } from "expo-router";

import {
  AppAlert,
  AppButton,
  AppScrollScreen,
  AppStack,
  AppText,
} from "@/design-system";

export interface ModulePlaceholderScreenProps {
  title: string;

  description: string;
}

export function ModulePlaceholderScreen({
  title,
  description,
}: ModulePlaceholderScreenProps) {
  const router = useRouter();

  return (
    <AppScrollScreen>
      <AppStack gap="xl">
        <AppStack gap="xs">
          <AppText variant="headlineSmall" weight="semibold">
            {title}
          </AppText>

          <AppText tone="muted">{description}</AppText>
        </AppStack>

        <AppAlert tone="info" title="Módulo preparado">
          Esta sección será implementada en los siguientes bloques.
        </AppAlert>

        <AppButton
          variant="outlined"
          tone="neutral"
          leadingIcon={ArrowLeft}
          onPress={() => {
            router.back();
          }}
        >
          Volver
        </AppButton>
      </AppStack>
    </AppScrollScreen>
  );
}
