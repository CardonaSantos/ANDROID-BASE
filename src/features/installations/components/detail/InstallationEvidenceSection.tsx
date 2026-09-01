import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  ImageIcon,
  Maximize2,
  Plus,
  X,
} from "lucide-react-native";

import { useMemo, useState } from "react";

import { Image, Linking, Modal, ScrollView, View } from "react-native";

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
  AppSnackbar,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  InstallationTechnicalDetail,
  InstallationTechnicalEvidence,
} from "../../api/installations.contracts.api";

import {
  formatEnumLabel,
  formatInstallationDate,
} from "../../installations.helpers";

/*
 * =========================================================
 * CONSTANTS
 * =========================================================
 */

const MAX_VISIBLE_IMAGES = 5;

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationEvidenceSectionProps {
  installation: InstallationTechnicalDetail;

  uploading?: boolean;

  onAddEvidence?: () => void;
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function isImageEvidence(evidence: InstallationTechnicalEvidence): boolean {
  return Boolean(
    evidence.url && evidence.mimeType?.toLowerCase().startsWith("image/"),
  );
}

function getEvidenceTitle(evidence: InstallationTechnicalEvidence): string {
  const title = evidence.titulo?.trim();

  if (title) {
    return title;
  }

  return formatEnumLabel(evidence.tipo);
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function InstallationEvidenceSection({
  installation,
  uploading = false,
  onAddEvidence,
}: InstallationEvidenceSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [fullscreen, setFullscreen] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);

  /*
   * =======================================================
   * SERVER ACTION
   * =======================================================
   */

  const canUpload =
    installation.acciones.subirEvidencia.habilitada && Boolean(onAddEvidence);

  /*
   * =======================================================
   * DATA
   * =======================================================
   */

  const evidences = useMemo(
    () =>
      [...installation.evidencias].sort((left, right) => {
        const orderDifference = left.orden - right.orden;

        if (orderDifference !== 0) {
          return orderDifference;
        }

        return left.id - right.id;
      }),

    [installation.evidencias],
  );

  const imageEvidences = useMemo(
    () => evidences.filter(isImageEvidence),

    [evidences],
  );

  const fileEvidences = useMemo(
    () => evidences.filter((evidence) => !isImageEvidence(evidence)),

    [evidences],
  );

  const visibleImages = imageEvidences.slice(0, MAX_VISIBLE_IMAGES);

  const selectedEvidence =
    selectedIndex !== null ? (imageEvidences[selectedIndex] ?? null) : null;

  /*
   * =======================================================
   * ORIGINAL URL
   * =======================================================
   */

  const handleOpenUrl = async (url: string | null) => {
    if (!url) {
      setFeedback("La evidencia no contiene una URL disponible.");

      return;
    }

    try {
      await Linking.openURL(url);
    } catch {
      setFeedback("No se pudo abrir la evidencia.");
    }
  };

  /*
   * =======================================================
   * PREVIEW
   * =======================================================
   */

  const handleOpenPreview = (evidence: InstallationTechnicalEvidence) => {
    const index = imageEvidences.findIndex(
      (current) => current.id === evidence.id,
    );

    if (index < 0) {
      return;
    }

    setSelectedIndex(index);
  };

  const handleClosePreview = () => {
    setSelectedIndex(null);

    setFullscreen(false);
  };

  const handlePrevious = () => {
    if (selectedIndex === null || imageEvidences.length === 0) {
      return;
    }

    setSelectedIndex(
      (selectedIndex - 1 + imageEvidences.length) % imageEvidences.length,
    );
  };

  const handleNext = () => {
    if (selectedIndex === null || imageEvidences.length === 0) {
      return;
    }

    setSelectedIndex((selectedIndex + 1) % imageEvidences.length);
  };

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <>
      <AppCard variant="outlined" radius="lg" padding="md">
        <AppStack gap="md">
          {/* =============================================
              HEADER
             ============================================= */}

          <AppInline gap="sm" align="center" justify="space-between" wrap>
            <AppInline gap="sm" align="center">
              <AppIcon icon={ImageIcon} size="md" tone="primary" decorative />

              <AppStack gap="xs">
                <AppText variant="titleMedium" weight="semibold">
                  Evidencias
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  {`${evidences.length} evidencia${
                    evidences.length === 1 ? "" : "s"
                  } registrada${evidences.length === 1 ? "" : "s"}`}
                </AppText>
              </AppStack>
            </AppInline>

            {canUpload ? (
              <AppButton
                size="sm"
                variant="solid"
                tone="primary"
                leadingIcon={Plus}
                loading={uploading}
                disabled={uploading}
                loadingAccessibilityLabel="Subiendo evidencia"
                accessibilityLabel="Agregar evidencia a la instalación"
                onPress={onAddEvidence}
              >
                Agregar evidencia
              </AppButton>
            ) : null}
          </AppInline>

          {/* =============================================
              EMPTY
             ============================================= */}

          {evidences.length === 0 ? (
            <AppCard variant="tonal" radius="md" padding="md">
              <AppStack gap="sm" align="center">
                <AppIcon icon={ImageIcon} size="lg" tone="muted" decorative />

                <AppText variant="bodyMedium" weight="semibold" align="center">
                  Sin evidencias
                </AppText>

                <AppText variant="bodySmall" tone="secondary" align="center">
                  Todavía no se han registrado archivos o fotografías para esta
                  instalación.
                </AppText>
              </AppStack>
            </AppCard>
          ) : null}

          {/* =============================================
              IMAGES
             ============================================= */}

          {imageEvidences.length > 0 ? (
            <AppStack gap="sm">
              <AppInline gap="sm" align="center" justify="space-between">
                <AppText variant="bodySmall" weight="semibold" tone="secondary">
                  Fotografías
                </AppText>

                <AppBadge size="sm" variant="soft" tone="neutral">
                  {imageEvidences.length}
                </AppBadge>
              </AppInline>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailList}
              >
                {visibleImages.map((evidence) => (
                  <AppPressable
                    key={evidence.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir evidencia ${getEvidenceTitle(
                      evidence,
                    )}`}
                    style={styles.thumbnailItem}
                    onPress={() => {
                      handleOpenPreview(evidence);
                    }}
                  >
                    <Image
                      source={{
                        uri: evidence.url!,
                      }}
                      resizeMode="cover"
                      style={styles.thumbnail}
                      accessibilityRole="image"
                      accessibilityLabel={getEvidenceTitle(evidence)}
                    />

                    <View style={styles.thumbnailBadge}>
                      <AppText variant="labelSmall" numberOfLines={1}>
                        {formatEnumLabel(evidence.tipo)}
                      </AppText>
                    </View>
                  </AppPressable>
                ))}

                {imageEvidences.length > MAX_VISIBLE_IMAGES ? (
                  <AppPressable
                    accessibilityRole="button"
                    accessibilityLabel="Abrir más evidencias"
                    style={styles.moreImages}
                    onPress={() => {
                      setSelectedIndex(MAX_VISIBLE_IMAGES);
                    }}
                  >
                    <AppIcon
                      icon={ImageIcon}
                      size="md"
                      tone="primary"
                      decorative
                    />

                    <AppText variant="bodySmall" weight="semibold">
                      {`+${imageEvidences.length - MAX_VISIBLE_IMAGES}`}
                    </AppText>
                  </AppPressable>
                ) : null}
              </ScrollView>
            </AppStack>
          ) : null}

          {/* =============================================
              FILES
             ============================================= */}

          {fileEvidences.length > 0 ? (
            <AppStack gap="sm">
              <AppInline gap="sm" align="center">
                <AppIcon icon={FileText} size="sm" tone="muted" decorative />

                <AppText variant="bodySmall" weight="semibold" tone="secondary">
                  Archivos
                </AppText>
              </AppInline>

              {fileEvidences.map((evidence) => (
                <AppCard
                  key={evidence.id}
                  variant="tonal"
                  radius="md"
                  padding="sm"
                >
                  <AppInline
                    gap="sm"
                    align="center"
                    justify="space-between"
                    wrap
                  >
                    <AppStack gap="xs" flex>
                      <AppText variant="bodyMedium" weight="semibold">
                        {getEvidenceTitle(evidence)}
                      </AppText>

                      <AppText variant="bodySmall" tone="secondary">
                        {formatEnumLabel(evidence.tipo)}
                      </AppText>

                      {evidence.mimeType ? (
                        <AppText variant="bodySmall" tone="secondary">
                          {evidence.mimeType}
                        </AppText>
                      ) : null}

                      <AppText variant="bodySmall" tone="secondary">
                        {formatInstallationDate(evidence.creadoEn)}
                      </AppText>

                      {evidence.descripcion ? (
                        <AppText variant="bodySmall" tone="secondary">
                          {evidence.descripcion}
                        </AppText>
                      ) : null}
                    </AppStack>

                    {evidence.url ? (
                      <AppButton
                        size="sm"
                        variant="ghost"
                        tone="primary"
                        leadingIcon={ExternalLink}
                        onPress={() => {
                          void handleOpenUrl(evidence.url);
                        }}
                      >
                        Abrir
                      </AppButton>
                    ) : null}
                  </AppInline>
                </AppCard>
              ))}
            </AppStack>
          ) : null}
        </AppStack>
      </AppCard>

      {/* ===================================================
          IMAGE PREVIEW
         =================================================== */}

      <AppDialog
        open={selectedEvidence !== null}
        onOpenChange={(open) => {
          if (!open) {
            handleClosePreview();
          }
        }}
        title={
          selectedEvidence ? getEvidenceTitle(selectedEvidence) : "Evidencia"
        }
        description={
          selectedEvidence ? formatEnumLabel(selectedEvidence.tipo) : undefined
        }
        size="lg"
        showCloseButton
        scrollable
        closeAccessibilityLabel="Cerrar vista previa"
        actions={
          selectedEvidence?.url ? (
            <AppButton
              size="sm"
              variant="ghost"
              tone="primary"
              leadingIcon={ExternalLink}
              onPress={() => {
                void handleOpenUrl(selectedEvidence.url);
              }}
            >
              Abrir original
            </AppButton>
          ) : undefined
        }
      >
        {selectedEvidence ? (
          <AppStack gap="md">
            <View style={styles.previewImageContainer}>
              <Image
                source={{
                  uri: selectedEvidence.url!,
                }}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={getEvidenceTitle(selectedEvidence)}
                style={styles.previewImage}
              />

              <View style={styles.previewToolbar}>
                <AppIconButton
                  icon={Maximize2}
                  size="sm"
                  variant="soft"
                  tone="neutral"
                  accessibilityLabel="Ver evidencia en pantalla completa"
                  onPress={() => {
                    setFullscreen(true);
                  }}
                />
              </View>
            </View>

            {imageEvidences.length > 1 ? (
              <AppInline gap="sm" align="center" justify="space-between">
                <AppIconButton
                  icon={ChevronLeft}
                  size="sm"
                  variant="outlined"
                  tone="neutral"
                  accessibilityLabel="Evidencia anterior"
                  onPress={handlePrevious}
                />

                <AppText variant="bodySmall" tone="secondary">
                  {`${(selectedIndex ?? 0) + 1} de ${imageEvidences.length}`}
                </AppText>

                <AppIconButton
                  icon={ChevronRight}
                  size="sm"
                  variant="outlined"
                  tone="neutral"
                  accessibilityLabel="Evidencia siguiente"
                  onPress={handleNext}
                />
              </AppInline>
            ) : null}

            {selectedEvidence.descripcion ? (
              <AppText variant="bodySmall" tone="secondary">
                {selectedEvidence.descripcion}
              </AppText>
            ) : null}

            <AppText variant="bodySmall" tone="secondary">
              {formatInstallationDate(selectedEvidence.creadoEn)}
            </AppText>
          </AppStack>
        ) : null}
      </AppDialog>

      {/* ===================================================
          FULLSCREEN
         =================================================== */}

      <Modal
        visible={fullscreen && selectedEvidence !== null}
        transparent={false}
        animationType="fade"
        onRequestClose={() => {
          setFullscreen(false);
        }}
      >
        <View style={styles.fullscreenRoot}>
          {selectedEvidence ? (
            <>
              <Image
                source={{
                  uri: selectedEvidence.url!,
                }}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={getEvidenceTitle(selectedEvidence)}
                style={styles.fullscreenImage}
              />

              <View style={styles.fullscreenClose}>
                <AppIconButton
                  icon={X}
                  size="md"
                  variant="soft"
                  tone="neutral"
                  accessibilityLabel="Cerrar pantalla completa"
                  onPress={() => {
                    setFullscreen(false);
                  }}
                />
              </View>

              {imageEvidences.length > 1 ? (
                <>
                  <View style={styles.fullscreenPrevious}>
                    <AppIconButton
                      icon={ChevronLeft}
                      size="md"
                      variant="soft"
                      tone="neutral"
                      accessibilityLabel="Evidencia anterior"
                      onPress={handlePrevious}
                    />
                  </View>

                  <View style={styles.fullscreenNext}>
                    <AppIconButton
                      icon={ChevronRight}
                      size="md"
                      variant="soft"
                      tone="neutral"
                      accessibilityLabel="Evidencia siguiente"
                      onPress={handleNext}
                    />
                  </View>
                </>
              ) : null}
            </>
          ) : null}
        </View>
      </Modal>

      <AppSnackbar
        open={feedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFeedback(null);
          }
        }}
        message={feedback ?? ""}
        tone="danger"
        position="bottom"
      />
    </>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles = StyleSheet.create((theme) => ({
  thumbnailList: {
    gap: theme.spacing.sm,
  },

  thumbnailItem: {
    width: 92,

    gap: theme.spacing.xs,
  },

  thumbnail: {
    width: 92,

    height: 92,

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surfaceSecondary,
  },

  thumbnailBadge: {
    maxWidth: 92,
  },

  moreImages: {
    width: 92,

    height: 92,

    borderRadius: theme.radius.md,

    alignItems: "center",

    justifyContent: "center",

    gap: theme.spacing.xs,

    backgroundColor: theme.colors.surfaceSecondary,
  },

  previewImageContainer: {
    width: "100%",

    aspectRatio: 4 / 3,

    overflow: "hidden",

    position: "relative",

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surfaceSecondary,
  },

  previewImage: {
    width: "100%",

    height: "100%",
  },

  previewToolbar: {
    position: "absolute",

    top: theme.spacing.sm,

    right: theme.spacing.sm,
  },

  fullscreenRoot: {
    flex: 1,

    position: "relative",

    backgroundColor: theme.colors.background,
  },

  fullscreenImage: {
    width: "100%",

    height: "100%",
  },

  fullscreenClose: {
    position: "absolute",

    top: theme.spacing.lg,

    right: theme.spacing.md,
  },

  fullscreenPrevious: {
    position: "absolute",

    left: theme.spacing.md,

    top: "50%",
  },

  fullscreenNext: {
    position: "absolute",

    right: theme.spacing.md,

    top: "50%",
  },
}));
