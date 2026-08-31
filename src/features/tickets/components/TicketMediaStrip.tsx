import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react-native";

import { useState } from "react";

import { Image, Modal, ScrollView, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StyleSheet } from "react-native-unistyles";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppDialog,
  AppIcon,
  AppIconButton,
  AppInline,
  AppPressable,
  AppStack,
  AppText,
} from "@/design-system";

import type { TicketMedia } from "../api/tickets.contracts.api";

export interface TicketMediaStripProps {
  medias: readonly TicketMedia[];
}

const MAX_VISIBLE_MEDIA = 4;

export function TicketMediaStrip({ medias }: TicketMediaStripProps) {
  const insets = useSafeAreaInsets();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  if (medias.length === 0) {
    return null;
  }

  const visibleMedias = medias.slice(0, MAX_VISIBLE_MEDIA);

  const extraCount = Math.max(0, medias.length - visibleMedias.length);

  const selectedMedia =
    selectedIndex !== null ? (medias[selectedIndex] ?? null) : null;

  const isPreviewOpen = selectedIndex !== null;

  const hasMultipleMedias = medias.length > 1;

  const openPreview = (index: number) => {
    setSelectedIndex(index);
  };

  const closePreview = () => {
    setIsFullscreen(false);

    setSelectedIndex(null);
  };

  const openFullscreen = () => {
    if (!selectedMedia) {
      return;
    }

    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const goPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) {
        return current;
      }

      return current <= 0 ? medias.length - 1 : current - 1;
    });
  };

  const goNext = () => {
    setSelectedIndex((current) => {
      if (current === null) {
        return current;
      }

      return current >= medias.length - 1 ? 0 : current + 1;
    });
  };

  const currentPosition = selectedIndex !== null ? selectedIndex + 1 : 0;

  return (
    <>
      {/* ===================================================
          STRIP
         =================================================== */}

      <AppCard variant="outlined" radius="md" padding="sm">
        <AppStack gap="sm">
          <AppInline gap="xs" align="center" justify="space-between">
            <AppInline gap="xs" align="center" flex>
              <AppIcon icon={ImageIcon} size={16} tone="muted" decorative />

              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Adjuntos
              </AppText>
            </AppInline>

            <AppBadge size="sm" tone="neutral" variant="soft">
              {`${currentPosition} / ${medias.length}`}
            </AppBadge>
          </AppInline>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaRow}
          >
            {visibleMedias.map((media, index) => (
              <AppPressable
                key={media.id}
                accessibilityRole="button"
                accessibilityLabel={`Ver adjunto ${index + 1} de ${
                  medias.length
                }`}
                touchTarget="none"
                hitSlopPreset="compact"
                interaction="subtle"
                haptic="selection"
                radius="md"
                style={styles.mediaButton}
                onPress={() => openPreview(index)}
              >
                <Image
                  source={{
                    uri: media.cdnUrl,
                  }}
                  resizeMode="cover"
                  accessible={false}
                  style={styles.thumbnail}
                />
              </AppPressable>
            ))}

            {extraCount > 0 ? (
              <AppPressable
                accessibilityRole="button"
                accessibilityLabel={`Ver ${extraCount} adjuntos adicionales`}
                touchTarget="none"
                hitSlopPreset="compact"
                interaction="subtle"
                haptic="selection"
                radius="md"
                style={styles.extraButton}
                onPress={() => openPreview(visibleMedias.length)}
              >
                <AppText variant="bodyMedium" tone="secondary" weight="bold">
                  +{extraCount}
                </AppText>
              </AppPressable>
            ) : null}
          </ScrollView>
        </AppStack>
      </AppCard>

      {/* ===================================================
          PREVIEW
         =================================================== */}

      <AppDialog
        open={isPreviewOpen}
        onOpenChange={(open) => {
          if (!open) {
            closePreview();
          }
        }}
        title="Adjuntos del ticket"
        description={
          selectedIndex !== null
            ? `Imagen ${currentPosition} de ${medias.length}`
            : undefined
        }
        icon={ImageIcon}
        size="lg"
        showCloseButton
        dismissable
        scrollable
        closeAccessibilityLabel="Cerrar vista previa"
        contentStyle={styles.dialogContent}
        actions={
          <AppInline
            gap="sm"
            align="center"
            justify="flex-end"
            wrap
            style={styles.previewActions}
          >
            <AppButton
              size="sm"
              variant="outlined"
              tone="neutral"
              leadingIcon={Maximize2}
              onPress={openFullscreen}
            >
              Pantalla completa
            </AppButton>

            <AppButton
              size="sm"
              variant="ghost"
              tone="neutral"
              onPress={closePreview}
            >
              Cerrar
            </AppButton>
          </AppInline>
        }
      >
        {selectedMedia ? (
          <AppStack gap="md">
            <View style={styles.previewImageContainer}>
              <Image
                source={{
                  uri: selectedMedia.cdnUrl,
                }}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={
                  selectedMedia.titulo?.trim() || `Adjunto ${currentPosition}`
                }
                style={styles.previewImage}
              />
            </View>

            {/* ===============================================
                CAROUSEL COMPACTO
               =============================================== */}

            {hasMultipleMedias ? (
              <AppInline
                gap="md"
                align="center"
                justify="center"
                style={styles.carouselControls}
              >
                <AppIconButton
                  icon={ChevronLeft}
                  size="sm"
                  variant="outlined"
                  tone="neutral"
                  interaction="subtle"
                  accessibilityLabel="Ver imagen anterior"
                  onPress={goPrevious}
                />

                <AppBadge size="sm" tone="neutral" variant="soft">
                  {`${currentPosition} / ${medias.length}`}
                </AppBadge>

                <AppIconButton
                  icon={ChevronRight}
                  size="sm"
                  variant="outlined"
                  tone="neutral"
                  interaction="subtle"
                  accessibilityLabel="Ver imagen siguiente"
                  onPress={goNext}
                />
              </AppInline>
            ) : null}

            {selectedMedia.titulo || selectedMedia.descripcion ? (
              <AppStack gap="xs">
                {selectedMedia.titulo ? (
                  <AppText variant="titleMedium" weight="semibold">
                    {selectedMedia.titulo}
                  </AppText>
                ) : null}

                {selectedMedia.descripcion ? (
                  <AppText variant="bodySmall" tone="secondary">
                    {selectedMedia.descripcion}
                  </AppText>
                ) : null}
              </AppStack>
            ) : null}
          </AppStack>
        ) : (
          <AppText variant="bodyMedium" tone="secondary" align="center">
            No se pudo cargar el adjunto.
          </AppText>
        )}
      </AppDialog>

      {/* ===================================================
          FULLSCREEN
         =================================================== */}

      <Modal
        visible={isFullscreen}
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
          {/* TOP BAR */}

          <AppInline
            gap="md"
            align="center"
            justify="space-between"
            style={styles.fullscreenHeader}
          >
            <AppBadge size="sm" tone="neutral" variant="soft">
              {`${currentPosition} / ${medias.length}`}
            </AppBadge>

            <AppInline gap="xs" align="center">
              <AppIconButton
                icon={Minimize2}
                size="sm"
                variant="ghost"
                tone="neutral"
                interaction="subtle"
                accessibilityLabel="Salir de pantalla completa"
                onPress={closeFullscreen}
              />

              <AppIconButton
                icon={X}
                size="sm"
                variant="ghost"
                tone="neutral"
                interaction="subtle"
                accessibilityLabel="Cerrar visor de imágenes"
                onPress={closePreview}
              />
            </AppInline>
          </AppInline>

          {/* IMAGE */}

          <View style={styles.fullscreenStage}>
            {selectedMedia ? (
              <Image
                source={{
                  uri: selectedMedia.cdnUrl,
                }}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={
                  selectedMedia.titulo?.trim() || `Adjunto ${currentPosition}`
                }
                style={styles.fullscreenImage}
              />
            ) : null}
          </View>

          {/* BOTTOM CAROUSEL */}

          {hasMultipleMedias ? (
            <AppInline
              gap="lg"
              align="center"
              justify="center"
              style={styles.fullscreenControls}
            >
              <AppIconButton
                icon={ChevronLeft}
                size="sm"
                variant="outlined"
                tone="neutral"
                interaction="subtle"
                accessibilityLabel="Ver imagen anterior"
                onPress={goPrevious}
              />

              <AppText variant="bodySmall" tone="secondary" weight="medium">
                {currentPosition} de {medias.length}
              </AppText>

              <AppIconButton
                icon={ChevronRight}
                size="sm"
                variant="outlined"
                tone="neutral"
                interaction="subtle"
                accessibilityLabel="Ver imagen siguiente"
                onPress={goNext}
              />
            </AppInline>
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  mediaRow: {
    gap: theme.spacing.xs,

    paddingVertical: theme.spacing.xs,
  },

  previewActions: {
    paddingTop: theme.spacing.md,
  },

  mediaButton: {
    width: 64,
    height: 64,

    flexShrink: 0,

    overflow: "hidden",

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surfaceSecondary,
  },

  thumbnail: {
    width: "100%",
    height: "100%",
  },

  extraButton: {
    width: 64,
    height: 64,

    flexShrink: 0,

    alignItems: "center",

    justifyContent: "center",

    borderWidth: 1,

    borderStyle: "dashed",

    borderColor: theme.colors.border,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surfaceSecondary,
  },

  dialogContent: {
    gap: theme.spacing.md,
  },

  previewImageContainer: {
    width: "100%",

    aspectRatio: 4 / 3,

    overflow: "hidden",

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surfaceSecondary,
  },

  previewImage: {
    width: "100%",

    height: "100%",
  },

  carouselControls: {
    /*
     * Evita que las flechas queden
     * pegadas al borde inferior
     * de la imagen.
     */
    marginTop: theme.spacing.sm,

    marginBottom: theme.spacing.xs,
  },

  /*
   * =====================================================
   * FULLSCREEN
   * =====================================================
   */

  fullscreenRoot: {
    flex: 1,

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

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: theme.spacing.sm,

    paddingVertical: theme.spacing.sm,
  },

  fullscreenImage: {
    width: "100%",

    height: "100%",
  },

  fullscreenControls: {
    flexShrink: 0,

    paddingTop: theme.spacing.md,

    paddingHorizontal: theme.spacing.md,

    paddingBottom: theme.spacing.lg,
  },
}));
