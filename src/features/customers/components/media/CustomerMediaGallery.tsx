import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Image,
  Modal,
  ScrollView,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import {
  AppBadge,
  AppIconButton,
  AppInline,
  AppPressable,
  AppStack,
  AppText,
} from "@/design-system";

import type { CustomerMedia } from "../../api/customers.contracts.api";

export interface CustomerMediaGalleryProps {
  images: readonly CustomerMedia[];
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;
const CAROUSEL_HEIGHT = 220;

export function CustomerMediaGallery({
  images,
}: CustomerMediaGalleryProps) {
  const insets = useSafeAreaInsets();
  const carouselRef = useRef<ScrollView | null>(null);

  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(
    () => new Set(),
  );

  const safeIndex = Math.min(
    Math.max(index, 0),
    Math.max(images.length - 1, 0),
  );

  const selected = images[safeIndex] ?? null;
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    setZoom(MIN_ZOOM);
  }, [safeIndex, fullscreen]);

  useEffect(() => {
    if (carouselWidth <= 0 || images.length === 0) {
      return;
    }

    carouselRef.current?.scrollTo({
      x: safeIndex * carouselWidth,
      y: 0,
      animated: false,
    });
  }, [carouselWidth, images.length, safeIndex]);

  if (images.length === 0) {
    return (
      <AppText variant="bodySmall" tone="secondary">
        Este cliente no tiene imágenes registradas.
      </AppText>
    );
  }

  const handleCarouselLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    if (width > 0 && width !== carouselWidth) {
      setCarouselWidth(width);
    }
  };

  const handleCarouselScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (carouselWidth <= 0) {
      return;
    }

    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / carouselWidth,
    );

    setIndex(
      Math.min(
        Math.max(nextIndex, 0),
        images.length - 1,
      ),
    );
  };

  const markImageFailed = (imageId: number) => {
    setFailedImageIds((current) => {
      if (current.has(imageId)) {
        return current;
      }

      const next = new Set(current);
      next.add(imageId);
      return next;
    });
  };

  const openFullscreen = (imageIndex: number) => {
    setIndex(imageIndex);
    setZoom(MIN_ZOOM);
    setFullscreen(true);
  };

  const closeFullscreen = () => {
    setZoom(MIN_ZOOM);
    setFullscreen(false);
  };

  const goPrevious = () => {
    setIndex((current) =>
      current <= 0 ? images.length - 1 : current - 1,
    );
  };

  const goNext = () => {
    setIndex((current) =>
      current >= images.length - 1 ? 0 : current + 1,
    );
  };

  const zoomIn = () => {
    setZoom((current) =>
      Math.min(MAX_ZOOM, current + ZOOM_STEP),
    );
  };

  const zoomOut = () => {
    setZoom((current) =>
      Math.max(MIN_ZOOM, current - ZOOM_STEP),
    );
  };

  const resetZoom = () => {
    setZoom(MIN_ZOOM);
  };

  return (
    <>
      <AppStack gap="sm">
        <View
          style={styles.carouselViewport}
          onLayout={handleCarouselLayout}
        >
          {carouselWidth > 0 ? (
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleCarouselScrollEnd}
              contentContainerStyle={styles.carouselContent}
            >
              {images.map((image, imageIndex) => {
                const failed = failedImageIds.has(image.id);

                return (
                  <View
                    key={image.id}
                    style={[
                      styles.carouselPage,
                      {
                        width: carouselWidth,
                      },
                    ]}
                  >
                    <AppPressable
                      accessibilityRole="button"
                      accessibilityLabel={`Abrir imagen ${imageIndex + 1} de ${images.length} en pantalla completa`}
                      interaction="subtle"
                      haptic="selection"
                      touchTarget="none"
                      radius="md"
                      style={styles.imagePressable}
                      onPress={() => openFullscreen(imageIndex)}
                    >
                      {failed ? (
                        <View style={styles.imageFallback}>
                          <AppText
                            variant="bodySmall"
                            tone="secondary"
                            align="center"
                          >
                            No se pudo cargar esta imagen.
                          </AppText>
                        </View>
                      ) : (
                        <Image
                          source={{ uri: image.cdnUrl }}
                          resizeMode="cover"
                          accessibilityRole="image"
                          accessibilityLabel={
                            image.titulo?.trim() ||
                            `Imagen ${imageIndex + 1} del cliente`
                          }
                          onError={() => {
                            markImageFailed(image.id);
                          }}
                          style={styles.image}
                        />
                      )}
                    </AppPressable>
                  </View>
                );
              })}
            </ScrollView>
          ) : null}
        </View>

        {hasMultipleImages ? (
          <AppInline
            gap="xs"
            align="center"
            justify="center"
            accessibilityLabel={`${safeIndex + 1} de ${images.length}`}
          >
            {images.map((image, imageIndex) => (
              <View
                key={`customer-media-indicator-${image.id}`}
                style={styles.indicator(imageIndex === safeIndex)}
              />
            ))}
          </AppInline>
        ) : null}

        <AppInline gap="sm" align="center" justify="space-between">
          <AppStack gap="xxs" flex>
            <AppText
              variant="bodySmall"
              weight="semibold"
              numberOfLines={1}
            >
              {selected?.titulo?.trim() || "Imagen del cliente"}
            </AppText>

            {selected?.descripcion?.trim() ? (
              <AppText
                variant="caption"
                tone="secondary"
                numberOfLines={2}
              >
                {selected.descripcion}
              </AppText>
            ) : null}
          </AppStack>

          <AppBadge size="sm" variant="soft" tone="neutral">
            {`${safeIndex + 1} / ${images.length}`}
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
        onRequestClose={closeFullscreen}
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
              <AppText
                variant="bodySmall"
                weight="semibold"
                numberOfLines={1}
              >
                {selected?.titulo?.trim() || "Imagen del cliente"}
              </AppText>

              <AppText variant="caption" tone="secondary">
                {safeIndex + 1} de {images.length} · {zoom.toFixed(1)}x
              </AppText>
            </AppStack>

            <AppIconButton
              icon={X}
              size="sm"
              variant="ghost"
              tone="neutral"
              accessibilityLabel="Cerrar galería"
              onPress={closeFullscreen}
            />
          </AppInline>

          <View style={styles.fullscreenStage}>
            {selected ? (
              failedImageIds.has(selected.id) ? (
                <View style={styles.imageFallback}>
                  <AppText
                    variant="bodySmall"
                    tone="secondary"
                    align="center"
                  >
                    No se pudo cargar esta imagen.
                  </AppText>
                </View>
              ) : (
                <Image
                  source={{ uri: selected.cdnUrl }}
                  resizeMode="contain"
                  accessibilityRole="image"
                  accessibilityLabel={
                    selected.titulo?.trim() ||
                    `Imagen ${safeIndex + 1} del cliente`
                  }
                  onError={() => {
                    markImageFailed(selected.id);
                  }}
                  style={[
                    styles.fullscreenImage,
                    {
                      transform: [{ scale: zoom }],
                    },
                  ]}
                />
              )
            ) : null}
          </View>

          <AppInline
            gap="xs"
            align="center"
            justify="center"
            wrap
            style={styles.fullscreenControls}
          >
            {hasMultipleImages ? (
              <AppIconButton
                icon={ChevronLeft}
                size="sm"
                variant="outlined"
                tone="neutral"
                accessibilityLabel="Imagen anterior"
                onPress={goPrevious}
              />
            ) : null}

            <AppIconButton
              icon={ZoomOut}
              size="sm"
              variant="outlined"
              tone="neutral"
              disabled={zoom <= MIN_ZOOM}
              accessibilityLabel="Alejar imagen"
              onPress={zoomOut}
            />

            <AppIconButton
              icon={RotateCcw}
              size="sm"
              variant="ghost"
              tone="neutral"
              disabled={zoom === MIN_ZOOM}
              accessibilityLabel="Restablecer zoom"
              onPress={resetZoom}
            />

            <AppIconButton
              icon={ZoomIn}
              size="sm"
              variant="outlined"
              tone="neutral"
              disabled={zoom >= MAX_ZOOM}
              accessibilityLabel="Acercar imagen"
              onPress={zoomIn}
            />

            {hasMultipleImages ? (
              <AppIconButton
                icon={ChevronRight}
                size="sm"
                variant="outlined"
                tone="neutral"
                accessibilityLabel="Imagen siguiente"
                onPress={goNext}
              />
            ) : null}
          </AppInline>

          {selected?.descripcion?.trim() ? (
            <AppText
              variant="caption"
              tone="secondary"
              align="center"
              numberOfLines={2}
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
  carouselViewport: {
    width: "100%",
    height: CAROUSEL_HEIGHT,
    overflow: "hidden",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceSecondary,
  },

  carouselContent: {
    height: CAROUSEL_HEIGHT,
  },

  carouselPage: {
    height: CAROUSEL_HEIGHT,
  },

  imagePressable: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: theme.colors.surfaceSecondary,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageFallback: {
    flex: 1,
    width: "100%",
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceSecondary,
  },

  indicator: (active: boolean) => ({
    width: active ? 16 : 6,
    height: 6,
    borderRadius: theme.radius.full,
    backgroundColor: active
      ? theme.colors.primaryStrong
      : theme.colors.borderStrong,
  }),

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
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },

  fullscreenImage: {
    width: "100%",
    height: "100%",
  },

  fullscreenControls: {
    flexShrink: 0,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  fullscreenCaption: {
    flexShrink: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
}));
