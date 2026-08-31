import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react-native";

import { useState } from "react";

import { ScrollView, View } from "react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppDialog,
  AppIcon,
  AppImage,
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
  console.log("las medias son: ", medias);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (medias.length === 0) {
    return null;
  }

  const visibleMedias = medias.slice(0, MAX_VISIBLE_MEDIA);

  const extraCount = Math.max(0, medias.length - visibleMedias.length);

  const selectedMedia =
    selectedIndex !== null ? (medias[selectedIndex] ?? null) : null;

  const isPreviewOpen = selectedIndex !== null;

  const openPreview = (index: number) => {
    setSelectedIndex(index);
  };

  const closePreview = () => {
    setSelectedIndex(null);
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

  return (
    <>
      <AppCard variant="outlined" radius="md" padding="sm">
        <AppStack gap="sm">
          <AppInline gap="xs" align="center" justify="space-between">
            <AppInline gap="xs" align="center" flex>
              <AppIcon icon={ImageIcon} size={16} tone="muted" decorative />

              <AppText variant="bodySmall" tone="secondary" weight="medium">
                Adjuntos
              </AppText>
            </AppInline>

            <AppBadge
              size="sm"
              tone="info"
              variant="soft"
              accessibilityLabel={`${medias.length} adjuntos`}
            >
              {medias.length}
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
                <AppImage
                  source={media.cdnUrl}
                  decorative
                  radius="md"
                  style={styles.thumbnail}
                  contentFit="cover"
                  loading="eager"
                  recyclingKey={String(media.id)}
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
            ? `Imagen ${selectedIndex + 1} de ${medias.length}`
            : undefined
        }
        icon={ImageIcon}
        size="lg"
        showCloseButton
        closeAccessibilityLabel="Cerrar vista previa"
        contentStyle={styles.dialogContent}
        actions={
          medias.length > 1 ? (
            <AppInline gap="sm" align="center">
              <AppButton
                size="sm"
                variant="outlined"
                tone="neutral"
                leadingIcon={ChevronLeft}
                fullWidth
                onPress={goPrevious}
              >
                Anterior
              </AppButton>

              <AppButton
                size="sm"
                variant="outlined"
                tone="neutral"
                trailingIcon={ChevronRight}
                fullWidth
                onPress={goNext}
              >
                Siguiente
              </AppButton>
            </AppInline>
          ) : undefined
        }
      >
        {selectedMedia ? (
          <View style={styles.previewContainer}>
            <AppImage
              source={selectedMedia.cdnUrl}
              accessibilityLabel={
                selectedMedia.titulo?.trim() ||
                `Adjunto ${(selectedIndex ?? 0) + 1}`
              }
              radius="md"
              aspectRatio={4 / 3}
              contentFit="contain"
              loading="eager"
              recyclingKey={String(selectedMedia.id)}
              style={styles.previewImage}
            />

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
          </View>
        ) : (
          <AppText variant="bodyMedium" tone="secondary" align="center">
            No se pudo cargar el adjunto.
          </AppText>
        )}
      </AppDialog>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  mediaRow: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },

  mediaButton: {
    width: 64,
    height: 64,
    flexShrink: 0,
  },

  thumbnail: {
    width: 64,
    height: 64,
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
    backgroundColor: theme.colors.surfaceSecondary,
  },

  dialogContent: {
    gap: theme.spacing.md,
  },

  previewContainer: {
    gap: theme.spacing.md,
  },

  previewImage: {
    width: "100%",
    backgroundColor: theme.colors.surfaceSecondary,
  },
}));
