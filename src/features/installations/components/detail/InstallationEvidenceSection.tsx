import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  ImageIcon,
} from "lucide-react-native";

import { useMemo, useState } from "react";

import { Image, Linking, ScrollView, View } from "react-native";

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
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function isImageEvidence(evidence: InstallationTechnicalEvidence): boolean {
  const mimeType = evidence.mimeType?.trim().toLowerCase();

  return Boolean(mimeType?.startsWith("image/"));
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
 * SECTION
 * =========================================================
 */

export function InstallationEvidenceSection({
  installation,
}: InstallationEvidenceSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [feedback, setFeedback] = useState<{
    message: string;

    tone: "success" | "danger";
  } | null>(null);

  /*
   * =======================================================
   * ORDER
   * =======================================================
   *
   * El servidor expone explícitamente "orden".
   *
   * Respetamos ese campo para presentación y utilizamos
   * id únicamente como desempate estable.
   * =======================================================
   */

  const evidences = useMemo(
    () =>
      [...installation.evidencias].sort(
        (first, second) => first.orden - second.orden || first.id - second.id,
      ),
    [installation.evidencias],
  );

  const imageEvidences = useMemo(
    () =>
      evidences.filter(
        (evidence) => Boolean(evidence.url) && isImageEvidence(evidence),
      ),
    [evidences],
  );

  const fileEvidences = useMemo(
    () =>
      evidences.filter(
        (evidence) => !evidence.url || !isImageEvidence(evidence),
      ),
    [evidences],
  );

  const visibleImages = imageEvidences.slice(0, MAX_VISIBLE_IMAGES);

  const extraImageCount = Math.max(
    0,
    imageEvidences.length - visibleImages.length,
  );

  const selectedEvidence =
    selectedIndex !== null ? (imageEvidences[selectedIndex] ?? null) : null;

  const currentPosition = selectedIndex !== null ? selectedIndex + 1 : 0;

  const hasMultipleImages = imageEvidences.length > 1;

  /*
   * =======================================================
   * PREVIEW
   * =======================================================
   */

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

      return current <= 0 ? imageEvidences.length - 1 : current - 1;
    });
  };

  const goNext = () => {
    setSelectedIndex((current) => {
      if (current === null) {
        return current;
      }

      return current >= imageEvidences.length - 1 ? 0 : current + 1;
    });
  };

  /*
   * =======================================================
   * OPEN ORIGINAL
   * =======================================================
   */

  const openEvidenceUrl = async (evidence: InstallationTechnicalEvidence) => {
    const url = evidence.url?.trim();

    if (!url) {
      setFeedback({
        message: "La evidencia no tiene un archivo disponible.",

        tone: "danger",
      });

      return;
    }

    try {
      await Linking.openURL(url);
    } catch {
      setFeedback({
        message: "No se pudo abrir el archivo de evidencia.",

        tone: "danger",
      });
    }
  };

  /*
   * =======================================================
   * EMPTY
   * =======================================================
   */

  if (evidences.length === 0) {
    return (
      <AppCard variant="outlined" radius="lg" padding="md">
        <AppStack gap="md" align="center">
          <AppIcon icon={ImageIcon} size="lg" tone="muted" decorative />

          <AppStack gap="xs" align="center">
            <AppText variant="titleMedium" weight="semibold" align="center">
              Sin evidencias
            </AppText>

            <AppText variant="bodySmall" tone="secondary" align="center">
              Esta instalación todavía no tiene evidencias registradas.
            </AppText>
          </AppStack>
        </AppStack>
      </AppCard>
    );
  }

  /*
   * =======================================================
   * CONTENT
   * =======================================================
   */

  return (
    <>
      <AppCard variant="outlined" radius="lg" padding="md">
        <AppStack gap="md">
          {/* ===============================================
              HEADER
             =============================================== */}

          <AppInline gap="sm" align="center" justify="space-between">
            <AppInline gap="sm" align="center" flex>
              <AppIcon icon={ImageIcon} size="md" tone="primary" decorative />

              <AppStack gap="xs" flex>
                <AppText variant="titleMedium" weight="semibold">
                  Evidencias
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  Fotografías y archivos registrados durante el trabajo.
                </AppText>
              </AppStack>
            </AppInline>

            <AppBadge
              size="sm"
              tone="info"
              variant="soft"
              accessibilityLabel={`${evidences.length} evidencias registradas`}
            >
              {`${evidences.length}`}
            </AppBadge>
          </AppInline>

          {/* ===============================================
              IMAGE GALLERY
             =============================================== */}

          {imageEvidences.length > 0 ? (
            <AppStack gap="sm">
              <AppText variant="bodySmall" tone="secondary" weight="semibold">
                Imágenes
              </AppText>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageRow}
              >
                {visibleImages.map((evidence, index) => (
                  <AppStack
                    key={evidence.id}
                    gap="xs"
                    style={styles.thumbnailItem}
                  >
                    <AppPressable
                      accessibilityRole="button"
                      accessibilityLabel={`Ver evidencia ${index + 1} de ${imageEvidences.length}`}
                      touchTarget="none"
                      hitSlopPreset="compact"
                      interaction="subtle"
                      haptic="selection"
                      radius="md"
                      style={styles.thumbnailButton}
                      onPress={() => {
                        openPreview(index);
                      }}
                    >
                      <Image
                        source={{
                          uri: evidence.url!,
                        }}
                        resizeMode="cover"
                        accessible={false}
                        style={styles.thumbnail}
                      />
                    </AppPressable>

                    <AppText
                      variant="bodySmall"
                      tone="secondary"
                      numberOfLines={1}
                      align="center"
                    >
                      {formatEnumLabel(evidence.tipo)}
                    </AppText>
                  </AppStack>
                ))}

                {extraImageCount > 0 ? (
                  <AppPressable
                    accessibilityRole="button"
                    accessibilityLabel={`Ver ${extraImageCount} evidencias adicionales`}
                    touchTarget="none"
                    hitSlopPreset="compact"
                    interaction="subtle"
                    haptic="selection"
                    radius="md"
                    style={styles.extraButton}
                    onPress={() => {
                      openPreview(visibleImages.length);
                    }}
                  >
                    <AppText
                      variant="bodyMedium"
                      tone="secondary"
                      weight="bold"
                    >
                      {`+${extraImageCount}`}
                    </AppText>
                  </AppPressable>
                ) : null}
              </ScrollView>
            </AppStack>
          ) : null}

          {/* ===============================================
              FILES / NON IMAGE
             =============================================== */}

          {fileEvidences.length > 0 ? (
            <AppStack gap="sm">
              <AppText variant="bodySmall" tone="secondary" weight="semibold">
                Otros archivos
              </AppText>

              {fileEvidences.map((evidence) => (
                <AppCard
                  key={evidence.id}
                  variant="tonal"
                  radius="md"
                  padding="sm"
                >
                  <AppInline gap="sm" align="center">
                    <AppIcon
                      icon={FileText}
                      size="sm"
                      tone="muted"
                      decorative
                    />

                    <AppStack gap="xs" flex>
                      <AppText
                        variant="bodyMedium"
                        weight="semibold"
                        numberOfLines={1}
                      >
                        {getEvidenceTitle(evidence)}
                      </AppText>

                      <AppText
                        variant="bodySmall"
                        tone="secondary"
                        numberOfLines={1}
                      >
                        {[
                          formatEnumLabel(evidence.tipo),

                          evidence.mimeType,

                          formatInstallationDate(evidence.creadoEn),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </AppText>
                    </AppStack>

                    <AppButton
                      size="sm"
                      variant="outlined"
                      tone="neutral"
                      leadingIcon={ExternalLink}
                      disabled={!evidence.url}
                      accessibilityLabel={`Abrir evidencia ${getEvidenceTitle(
                        evidence,
                      )}`}
                      onPress={() => {
                        void openEvidenceUrl(evidence);
                      }}
                    >
                      Abrir
                    </AppButton>
                  </AppInline>
                </AppCard>
              ))}
            </AppStack>
          ) : null}
        </AppStack>
      </AppCard>

      {/* ====================================================
          IMAGE PREVIEW
         ==================================================== */}

      <AppDialog
        open={selectedIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            closePreview();
          }
        }}
        title="Evidencia de instalación"
        description={
          selectedEvidence
            ? `${formatEnumLabel(
                selectedEvidence.tipo,
              )} · ${currentPosition} de ${imageEvidences.length}`
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
          <AppInline gap="sm" align="center" justify="flex-end" wrap>
            {selectedEvidence?.url ? (
              <AppButton
                size="sm"
                variant="outlined"
                tone="neutral"
                leadingIcon={ExternalLink}
                onPress={() => {
                  void openEvidenceUrl(selectedEvidence);
                }}
              >
                Abrir original
              </AppButton>
            ) : null}

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
        {selectedEvidence?.url ? (
          <AppStack gap="md">
            <View style={styles.previewImageContainer}>
              <Image
                source={{
                  uri: selectedEvidence.url,
                }}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={getEvidenceTitle(selectedEvidence)}
                style={styles.previewImage}
              />
            </View>

            {/* ===============================================
                CAROUSEL
               =============================================== */}

            {hasMultipleImages ? (
              <AppInline gap="md" align="center" justify="center">
                <AppIconButton
                  icon={ChevronLeft}
                  size="sm"
                  variant="outlined"
                  tone="neutral"
                  interaction="subtle"
                  accessibilityLabel="Ver evidencia anterior"
                  onPress={goPrevious}
                />

                <AppBadge size="sm" tone="neutral" variant="soft">
                  {`${currentPosition} / ${imageEvidences.length}`}
                </AppBadge>

                <AppIconButton
                  icon={ChevronRight}
                  size="sm"
                  variant="outlined"
                  tone="neutral"
                  interaction="subtle"
                  accessibilityLabel="Ver evidencia siguiente"
                  onPress={goNext}
                />
              </AppInline>
            ) : null}

            {/* ===============================================
                METADATA
               =============================================== */}

            <AppStack gap="sm">
              <AppInline gap="xs" align="center" wrap>
                <AppBadge size="sm" tone="info" variant="soft">
                  {formatEnumLabel(selectedEvidence.tipo)}
                </AppBadge>

                <AppText variant="bodySmall" tone="secondary">
                  {formatInstallationDate(selectedEvidence.creadoEn)}
                </AppText>
              </AppInline>

              {selectedEvidence.titulo ? (
                <AppText variant="titleMedium" weight="semibold">
                  {selectedEvidence.titulo}
                </AppText>
              ) : null}

              {selectedEvidence.descripcion ? (
                <AppText variant="bodyMedium" tone="secondary">
                  {selectedEvidence.descripcion}
                </AppText>
              ) : null}
            </AppStack>
          </AppStack>
        ) : (
          <AppText variant="bodyMedium" tone="secondary" align="center">
            No se pudo cargar la evidencia.
          </AppText>
        )}
      </AppDialog>

      {/* ====================================================
          FEEDBACK
         ==================================================== */}

      <AppSnackbar
        open={feedback !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFeedback(null);
          }
        }}
        message={feedback?.message ?? ""}
        tone={feedback?.tone ?? "success"}
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
  imageRow: {
    gap: theme.spacing.sm,

    paddingVertical: theme.spacing.xs,
  },

  thumbnailItem: {
    width: 92,

    flexShrink: 0,
  },

  thumbnailButton: {
    width: 92,

    height: 92,

    overflow: "hidden",

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surfaceSecondary,
  },

  thumbnail: {
    width: "100%",

    height: "100%",
  },

  extraButton: {
    width: 92,

    height: 92,

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
}));
