import { Crop, ImageIcon } from "lucide-react-native";

import { useEffect, useMemo, useState } from "react";

import { Image, Platform, View, type LayoutChangeEvent } from "react-native";

import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import { StyleSheet } from "react-native-unistyles";

import {
  AppButton,
  AppCard,
  AppIcon,
  AppInline,
  AppSlider,
  AppStack,
  AppText,
} from "@/design-system";

import type { InstallationEvidenceUploadFile } from "../api/installation-evidence.api";

/*
 * =========================================================
 * CANDIDATE
 * =========================================================
 */

export interface InstallationEvidenceCropCandidate {
  file: InstallationEvidenceUploadFile;

  width: number;

  height: number;
}

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationEvidenceCropEditorProps {
  candidate: InstallationEvidenceCropCandidate;

  current: number;

  total: number;

  disabled?: boolean;

  onCancel: () => void;

  onResolve: (file: InstallationEvidenceUploadFile) => void | Promise<void>;
}

/*
 * =========================================================
 * CONSTANTS
 * =========================================================
 */

const CROP_ASPECT = 4 / 3;

const MIN_CROP_PERCENT = 35;

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function clamp(
  value: number,

  min: number,

  max: number,
) {
  return Math.min(
    Math.max(value, min),

    max,
  );
}

function buildCroppedName(name: string) {
  const baseName = name.replace(/\.[^/.]+$/, "");

  return `${baseName}-crop.jpg`;
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function InstallationEvidenceCropEditor({
  candidate,
  current,
  total,
  disabled = false,
  onCancel,
  onResolve,
}: InstallationEvidenceCropEditorProps) {
  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [cropPercent, setCropPercent] = useState(100);

  const [horizontalPercent, setHorizontalPercent] = useState(50);

  const [verticalPercent, setVerticalPercent] = useState(50);

  const [canvasSize, setCanvasSize] = useState({
    width: 0,

    height: 0,
  });

  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * =======================================================
   * RESET BETWEEN IMAGES
   * =======================================================
   */

  useEffect(() => {
    setCropPercent(100);

    setHorizontalPercent(50);

    setVerticalPercent(50);

    setError(null);
  }, [candidate.file.uri]);

  /*
   * =======================================================
   * DIMENSIONS
   * =======================================================
   */

  const sourceWidth = candidate.width;

  const sourceHeight = candidate.height;

  const hasValidDimensions = sourceWidth > 0 && sourceHeight > 0;

  const isBusy = disabled || processing;

  /*
   * =======================================================
   * REAL CROP RECT
   * =======================================================
   */

  const cropRect = useMemo(() => {
    if (!hasValidDimensions) {
      return null;
    }

    const sourceAspect = sourceWidth / sourceHeight;

    let maximumWidth = sourceWidth;

    let maximumHeight = sourceHeight;

    /*
     * Encontramos primero el rectángulo 4:3
     * más grande que cabe dentro de la imagen.
     */

    if (sourceAspect > CROP_ASPECT) {
      maximumHeight = sourceHeight;

      maximumWidth = maximumHeight * CROP_ASPECT;
    } else {
      maximumWidth = sourceWidth;

      maximumHeight = maximumWidth / CROP_ASPECT;
    }

    const scale = cropPercent / 100;

    const width = Math.max(
      1,

      maximumWidth * scale,
    );

    const height = Math.max(
      1,

      maximumHeight * scale,
    );

    const availableX = Math.max(
      0,

      sourceWidth - width,
    );

    const availableY = Math.max(
      0,

      sourceHeight - height,
    );

    const originX = availableX * (horizontalPercent / 100);

    const originY = availableY * (verticalPercent / 100);

    return {
      originX: clamp(originX, 0, availableX),

      originY: clamp(originY, 0, availableY),

      width,

      height,
    };
  }, [
    cropPercent,
    hasValidDimensions,
    horizontalPercent,
    sourceHeight,
    sourceWidth,
    verticalPercent,
  ]);

  /*
   * =======================================================
   * PREVIEW RECT
   * =======================================================
   */

  const previewRect = useMemo(() => {
    if (
      !cropRect ||
      canvasSize.width <= 0 ||
      canvasSize.height <= 0 ||
      sourceWidth <= 0 ||
      sourceHeight <= 0
    ) {
      return null;
    }

    const scale = Math.min(
      canvasSize.width / sourceWidth,

      canvasSize.height / sourceHeight,
    );

    const renderedWidth = sourceWidth * scale;

    const renderedHeight = sourceHeight * scale;

    const offsetX = (canvasSize.width - renderedWidth) / 2;

    const offsetY = (canvasSize.height - renderedHeight) / 2;

    return {
      left: offsetX + cropRect.originX * scale,

      top: offsetY + cropRect.originY * scale,

      width: cropRect.width * scale,

      height: cropRect.height * scale,
    };
  }, [
    canvasSize.height,
    canvasSize.width,
    cropRect,
    sourceHeight,
    sourceWidth,
  ]);

  /*
   * =======================================================
   * WEB FILE
   * =======================================================
   */

  const createWebBlob = async (uri: string): Promise<Blob | undefined> => {
    if (Platform.OS !== "web") {
      return undefined;
    }

    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error("Could not load cropped image.");
    }

    return response.blob();
  };

  /*
   * =======================================================
   * USE ORIGINAL
   * =======================================================
   */

  const handleUseOriginal = async () => {
    if (isBusy) {
      return;
    }

    setError(null);

    await onResolve(candidate.file);
  };

  /*
   * =======================================================
   * APPLY CROP
   * =======================================================
   */

  const handleApplyCrop = async () => {
    if (!cropRect || isBusy) {
      return;
    }

    try {
      setProcessing(true);

      setError(null);

      const context = ImageManipulator.manipulate(candidate.file.uri);

      context.crop({
        originX: Math.round(cropRect.originX),

        originY: Math.round(cropRect.originY),

        width: Math.max(
          1,

          Math.round(cropRect.width),
        ),

        height: Math.max(
          1,

          Math.round(cropRect.height),
        ),
      });

      const rendered = await context.renderAsync();

      const saved = await rendered.saveAsync({
        format: SaveFormat.JPEG,

        compress: 0.92,
      });

      const webFile = await createWebBlob(saved.uri);

      await onResolve({
        uri: saved.uri,

        name: buildCroppedName(candidate.file.name),

        mimeType: webFile?.type || "image/jpeg",

        webFile,
      });
    } catch {
      setError(
        "No se pudo recortar la imagen. Puedes conservar la fotografía completa o intentarlo nuevamente.",
      );
    } finally {
      setProcessing(false);
    }
  };

  /*
   * =======================================================
   * LAYOUT
   * =======================================================
   */

  const handleCanvasLayout = (event: LayoutChangeEvent) => {
    setCanvasSize({
      width: event.nativeEvent.layout.width,

      height: event.nativeEvent.layout.height,
    });
  };

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <AppStack gap="md">
      {/* ===================================================
          HEADER
         =================================================== */}

      <AppInline gap="sm" align="center" justify="space-between" wrap>
        <AppInline gap="sm" align="center">
          <AppIcon icon={Crop} size="md" tone="primary" decorative />

          <AppStack gap="xs">
            <AppText variant="titleMedium" weight="semibold">
              Recortar evidencia
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              {`Imagen ${current} de ${total}`}
            </AppText>
          </AppStack>
        </AppInline>

        <AppButton
          size="sm"
          variant="ghost"
          tone="neutral"
          disabled={isBusy}
          onPress={onCancel}
        >
          Cancelar selección
        </AppButton>
      </AppInline>

      {/* ===================================================
          EDITOR CARD
         =================================================== */}

      <AppCard variant="outlined" radius="lg" padding="md">
        <AppStack gap="lg">
          {/* ===============================================
              IMAGE
             =============================================== */}

          <View style={styles.canvas} onLayout={handleCanvasLayout}>
            <Image
              source={{
                uri: candidate.file.uri,
              }}
              resizeMode="contain"
              style={styles.image}
              accessibilityRole="image"
              accessibilityLabel="Imagen preparada para recorte"
            />

            {previewRect ? (
              <View
                pointerEvents="none"
                style={[
                  styles.cropFrame,

                  {
                    left: previewRect.left,

                    top: previewRect.top,

                    width: previewRect.width,

                    height: previewRect.height,
                  },
                ]}
              >
                <View style={styles.gridVerticalOne} />

                <View style={styles.gridVerticalTwo} />

                <View style={styles.gridHorizontalOne} />

                <View style={styles.gridHorizontalTwo} />
              </View>
            ) : null}
          </View>

          {/* ===============================================
              FILE INFO
             =============================================== */}

          <AppStack gap="xs">
            <AppText variant="bodyMedium" weight="semibold" numberOfLines={2}>
              {candidate.file.name}
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              {`${sourceWidth} × ${sourceHeight} · ${candidate.file.mimeType}`}
            </AppText>
          </AppStack>

          {/* ===============================================
              INVALID DIMENSIONS
             =============================================== */}

          {!hasValidDimensions ? (
            <AppCard variant="tonal" radius="md" padding="md">
              <AppStack gap="sm" align="center">
                <AppIcon icon={ImageIcon} size="lg" tone="muted" decorative />

                <AppText variant="bodySmall" tone="secondary" align="center">
                  No se pudieron determinar las dimensiones de esta imagen.
                  Puedes conservar el archivo original.
                </AppText>
              </AppStack>
            </AppCard>
          ) : null}

          {/* ===============================================
              CONTROLS
             =============================================== */}

          {hasValidDimensions ? (
            <AppStack gap="md">
              <AppSlider
                label="Tamaño del recorte"
                description="100% utiliza la región 4:3 más grande posible."
                value={cropPercent}
                min={MIN_CROP_PERCENT}
                max={100}
                step={1}
                showValue
                formatValue={(value) => `${Math.round(value)}%`}
                disabled={isBusy}
                accessibilityLabel="Tamaño del recorte"
                onValueChange={setCropPercent}
              />

              <AppSlider
                label="Posición horizontal"
                value={horizontalPercent}
                min={0}
                max={100}
                step={1}
                showValue
                formatValue={(value) => `${Math.round(value)}%`}
                disabled={isBusy}
                accessibilityLabel="Posición horizontal del recorte"
                onValueChange={setHorizontalPercent}
              />

              <AppSlider
                label="Posición vertical"
                value={verticalPercent}
                min={0}
                max={100}
                step={1}
                showValue
                formatValue={(value) => `${Math.round(value)}%`}
                disabled={isBusy}
                accessibilityLabel="Posición vertical del recorte"
                onValueChange={setVerticalPercent}
              />
            </AppStack>
          ) : null}

          {/* ===============================================
              ERROR
             =============================================== */}

          {error ? (
            <AppCard variant="tonal" radius="md" padding="sm">
              <AppText variant="bodySmall" tone="danger">
                {error}
              </AppText>
            </AppCard>
          ) : null}

          {/* ===============================================
              ACTIONS
             =============================================== */}

          <AppInline gap="sm" justify="flex-end" wrap>
            <AppButton
              variant="outlined"
              tone="neutral"
              disabled={isBusy}
              onPress={() => {
                void handleUseOriginal();
              }}
            >
              Usar completa
            </AppButton>

            <AppButton
              variant="solid"
              tone="primary"
              leadingIcon={Crop}
              loading={processing}
              disabled={isBusy || !cropRect}
              loadingAccessibilityLabel="Recortando evidencia"
              onPress={() => {
                void handleApplyCrop();
              }}
            >
              Aplicar recorte
            </AppButton>
          </AppInline>
        </AppStack>
      </AppCard>
    </AppStack>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles = StyleSheet.create((theme) => ({
  canvas: {
    width: "100%",

    height: 420,

    position: "relative",

    overflow: "hidden",

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surfaceSecondary,
  },

  image: {
    width: "100%",

    height: "100%",
  },

  cropFrame: {
    position: "absolute",

    borderWidth: 2,

    borderColor: theme.colors.primary,
  },

  gridVerticalOne: {
    position: "absolute",

    left: "33.333%",

    top: 0,

    bottom: 0,

    width: 1,

    backgroundColor: "rgba(255,255,255,0.65)",
  },

  gridVerticalTwo: {
    position: "absolute",

    left: "66.666%",

    top: 0,

    bottom: 0,

    width: 1,

    backgroundColor: "rgba(255,255,255,0.65)",
  },

  gridHorizontalOne: {
    position: "absolute",

    top: "33.333%",

    left: 0,

    right: 0,

    height: 1,

    backgroundColor: "rgba(255,255,255,0.65)",
  },

  gridHorizontalTwo: {
    position: "absolute",

    top: "66.666%",

    left: 0,

    right: 0,

    height: 1,

    backgroundColor: "rgba(255,255,255,0.65)",
  },
}));
