import { useMemo, useState } from "react";
import { Modal, View, useWindowDimensions } from "react-native";
import { X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import {
  AppBadge,
  AppCarousel,
  AppIconButton,
  AppImage,
  AppImageGallery,
  AppInline,
  AppPressable,
  AppStack,
  AppText,
} from "@/design-system";

import type { CustomerMedia } from "../../api/customers.contracts.api";

export interface CustomerMediaGalleryProps {
  images: readonly CustomerMedia[];
}

export function CustomerMediaGallery({ images }: CustomerMediaGalleryProps) {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const safeIndex = Math.min(Math.max(index, 0), Math.max(images.length - 1, 0));
  const selected = images[safeIndex] ?? null;

  const fullscreenItems = useMemo(
    () =>
      images.map((image) => ({
        id: String(image.id),
        source: { uri: image.cdnUrl },
        accessibilityLabel: image.titulo?.trim() || "Imagen del cliente",
        recyclingKey: `customer-media-${image.id}`,
      })),
    [images],
  );

  if (images.length === 0) {
    return (
      <AppText variant="bodySmall" tone="secondary">
        Este cliente no tiene imágenes registradas.
      </AppText>
    );
  }

  const fullscreenHeight = Math.max(
    280,
    window.height - insets.top - insets.bottom - 112,
  );

  return (
    <>
      <AppStack gap="sm">
        <AppCarousel
          items={images}
          keyExtractor={(image) => String(image.id)}
          index={safeIndex}
          onIndexChange={setIndex}
          height={220}
          showIndicators
          accessibilityLabel="Galería del cliente"
          renderItem={(image, imageIndex) => (
            <AppPressable
              accessibilityRole="button"
              accessibilityLabel={`Abrir imagen ${imageIndex + 1} de ${images.length}`}
              interaction="subtle"
              haptic="selection"
              touchTarget="none"
              radius="md"
              style={styles.imagePressable}
              onPress={() => {
                setIndex(imageIndex);
                setFullscreen(true);
              }}
            >
              <AppImage
                source={{ uri: image.cdnUrl }}
                contentFit="cover"
                cachePolicy="memory-disk"
                recyclingKey={`customer-profile-${image.id}`}
                accessibilityLabel={image.titulo?.trim() || "Imagen del cliente"}
                radius="md"
                style={styles.image}
              />
            </AppPressable>
          )}
        />

        <AppInline gap="sm" align="center" justify="space-between">
          <AppStack gap="xxs" flex>
            <AppText variant="bodySmall" weight="semibold" numberOfLines={1}>
              {selected?.titulo?.trim() || "Imagen del cliente"}
            </AppText>
            {selected?.descripcion?.trim() ? (
              <AppText variant="caption" tone="secondary" numberOfLines={2}>
                {selected.descripcion}
              </AppText>
            ) : null}
          </AppStack>

          <AppBadge size="sm" variant="soft" tone="neutral">
            {safeIndex + 1} / {images.length}
          </AppBadge>
        </AppInline>
      </AppStack>

      <Modal
        visible={fullscreen}
        transparent={false}
        animationType="fade"
        presentationStyle="fullScreen"
        hardwareAccelerated
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setFullscreen(false)}
      >
        <View
          style={[
            styles.fullscreenRoot,
            {
              paddingTop: insets.top,
              paddingRight: insets.right,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
            },
          ]}
        >
          <AppInline
            gap="sm"
            align="center"
            justify="space-between"
            style={styles.fullscreenHeader}
          >
            <AppStack gap="xxs" flex>
              <AppText variant="bodySmall" weight="semibold" numberOfLines={1}>
                {selected?.titulo?.trim() || "Imagen del cliente"}
              </AppText>
              <AppText variant="caption" tone="secondary">
                {safeIndex + 1} de {images.length}
              </AppText>
            </AppStack>

            <AppIconButton
              icon={X}
              size="sm"
              variant="ghost"
              tone="neutral"
              accessibilityLabel="Cerrar galería"
              onPress={() => setFullscreen(false)}
            />
          </AppInline>

          <View style={styles.fullscreenStage}>
            <AppImageGallery
              items={fullscreenItems}
              index={safeIndex}
              onIndexChange={setIndex}
              height={fullscreenHeight}
              contentFit="contain"
              showIndicators={images.length > 1}
              accessibilityLabel="Galería del cliente en pantalla completa"
            />
          </View>

          {selected?.descripcion?.trim() ? (
            <AppText
              variant="caption"
              tone="secondary"
              align="center"
              style={styles.fullscreenCaption}
            >
              {selected.descripcion}
            </AppText>
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  imagePressable: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fullscreenRoot: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.colors.background,
  },
  fullscreenHeader: {
    flexShrink: 0,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  fullscreenStage: {
    flex: 1,
    minHeight: 0,
    justifyContent: "center",
  },
  fullscreenCaption: {
    flexShrink: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
}));
