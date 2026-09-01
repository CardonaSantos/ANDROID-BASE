import { Camera, ImageIcon, Images, Trash2, Upload } from "lucide-react-native";

import { useMemo, useState } from "react";

import { Image, Platform, View } from "react-native";

import * as ImagePicker from "expo-image-picker";

import { StyleSheet } from "react-native-unistyles";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppGrid,
  AppIcon,
  AppInline,
  AppSelect,
  AppStack,
  AppText,
  AppTextArea,
} from "@/design-system";

import type {
  InstallationEvidenceType,
  InstallationEvidenceUploadFile,
} from "../api/installation-evidence.api";

import {
  InstallationEvidenceCropEditor,
  type InstallationEvidenceCropCandidate,
} from "./InstallationEvidenceCropEditor";

/*
 * =========================================================
 * PUBLIC DRAFT
 * =========================================================
 */

export interface InstallationEvidenceWorkspaceDraft {
  file: InstallationEvidenceUploadFile;

  tipo: InstallationEvidenceType;

  descripcion?: string | null;

  orden: number;
}

/*
 * =========================================================
 * BATCH RESULT
 * =========================================================
 */

export interface InstallationEvidenceBatchResult {
  total: number;

  uploaded: number;

  failed: number;
}

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

export interface InstallationEvidenceWorkspaceProps {
  loading?: boolean;

  onSubmit: (draft: InstallationEvidenceWorkspaceDraft) => void | Promise<void>;

  onBatchComplete?: (result: InstallationEvidenceBatchResult) => void;
}

/*
 * =========================================================
 * LOCAL TYPES
 * =========================================================
 */

type EvidenceUploadStatus = "pending" | "uploading" | "success" | "error";

interface EvidenceQueueItem {
  id: string;

  file: InstallationEvidenceUploadFile;

  tipo: InstallationEvidenceType | null;

  descripcion: string;

  orden: number;

  status: EvidenceUploadStatus;
}

/*
 * =========================================================
 * OPTIONS
 * =========================================================
 */

const EVIDENCE_TYPE_OPTIONS: ReadonlyArray<{
  value: InstallationEvidenceType;

  label: string;

  description?: string;
}> = [
  {
    value: "ANTES",

    label: "Antes",

    description: "Estado previo al trabajo.",
  },

  {
    value: "DESPUES",

    label: "Después",

    description: "Resultado posterior al trabajo.",
  },

  {
    value: "EQUIPO",

    label: "Equipo",
  },

  {
    value: "ROUTER",

    label: "Router",
  },

  {
    value: "ONU",

    label: "ONU",
  },

  {
    value: "ANTENA",

    label: "Antena",
  },

  {
    value: "CABLEADO",

    label: "Cableado",
  },

  {
    value: "UBICACION",

    label: "Ubicación",
  },

  {
    value: "FIRMA",

    label: "Firma",
  },

  {
    value: "BOLETA",

    label: "Boleta",
  },

  {
    value: "RECIBO",

    label: "Recibo",
  },

  {
    value: "DOCUMENTO",

    label: "Documento",
  },

  {
    value: "OTRO",

    label: "Otro",
  },
];

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function createDraftId() {
  return [Date.now(), Math.random().toString(36).slice(2)].join("-");
}

function getExtensionFromMimeType(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "image/heic":
      return "heic";

    case "image/heif":
      return "heif";

    default:
      return "jpg";
  }
}

function getAssetFileName(asset: ImagePicker.ImagePickerAsset): string {
  const webName = asset.file?.name?.trim();

  if (webName) {
    return webName;
  }

  const fileName = asset.fileName?.trim();

  if (fileName) {
    return fileName;
  }

  const mimeType = asset.mimeType || asset.file?.type || "image/jpeg";

  return ["evidencia", Date.now(), getExtensionFromMimeType(mimeType)].join(
    ".",
  );
}

function mapAssetToCandidate(
  asset: ImagePicker.ImagePickerAsset,
): InstallationEvidenceCropCandidate {
  const mimeType = asset.mimeType || asset.file?.type || "image/jpeg";

  return {
    width: asset.width,

    height: asset.height,

    file: {
      uri: asset.uri,

      name: getAssetFileName(asset),

      mimeType,

      webFile: asset.file,
    },
  };
}

function getStatusMeta(status: EvidenceUploadStatus): {
  label: string;

  tone: "neutral" | "info" | "success" | "danger";
} {
  switch (status) {
    case "uploading":
      return {
        label: "Subiendo",

        tone: "info",
      };

    case "success":
      return {
        label: "Subida",

        tone: "success",
      };

    case "error":
      return {
        label: "Error",

        tone: "danger",
      };

    default:
      return {
        label: "Pendiente",

        tone: "neutral",
      };
  }
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function InstallationEvidenceWorkspace({
  loading = false,
  onSubmit,
  onBatchComplete,
}: InstallationEvidenceWorkspaceProps) {
  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [evidences, setEvidences] = useState<EvidenceQueueItem[]>([]);

  const [cropCandidates, setCropCandidates] = useState<
    InstallationEvidenceCropCandidate[]
  >([]);

  const [cropTotal, setCropTotal] = useState(0);

  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);

  const [uploadProgress, setUploadProgress] = useState({
    current: 0,

    total: 0,
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  /*
   * =======================================================
   * DERIVED
   * =======================================================
   */

  const currentCropCandidate = cropCandidates[0] ?? null;

  const isBusy = loading || isSubmittingBatch;

  const currentCropNumber = currentCropCandidate
    ? cropTotal - cropCandidates.length + 1
    : 0;

  const canSubmit =
    evidences.length > 0 &&
    evidences.every((evidence) => evidence.tipo !== null) &&
    !isBusy &&
    !currentCropCandidate;

  const selectedLabel = useMemo(
    () =>
      `${evidences.length} imagen${
        evidences.length === 1 ? "" : "es"
      } preparada${evidences.length === 1 ? "" : "s"}`,

    [evidences.length],
  );

  /*
   * =======================================================
   * CROP QUEUE
   * =======================================================
   */

  const handleResolveCrop = (file: InstallationEvidenceUploadFile) => {
    setEvidences((current) => [
      ...current,

      {
        id: createDraftId(),

        file,

        tipo: null,

        descripcion: "",

        orden: current.length,

        status: "pending",
      },
    ]);

    setCropCandidates((current) => current.slice(1));
  };

  const handleCancelCropQueue = () => {
    setCropCandidates([]);

    setCropTotal(0);
  };

  /*
   * =======================================================
   * PICKER RESULT
   * =======================================================
   */

  const consumeResult = (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || !result.assets?.length) {
      return;
    }

    const validAssets = result.assets.filter(
      (asset) => !asset.type || asset.type === "image",
    );

    const invalidCount = result.assets.length - validAssets.length;

    if (invalidCount > 0) {
      setFeedback(
        `${invalidCount} archivo(s) fueron omitidos porque no son imágenes válidas.`,
      );
    } else {
      setFeedback(null);
    }

    if (validAssets.length === 0) {
      return;
    }

    const candidates = validAssets.map(mapAssetToCandidate);

    setCropCandidates(candidates);

    setCropTotal(candidates.length);
  };

  /*
   * =======================================================
   * CAMERA
   * =======================================================
   */

  const handleTakePhoto = async () => {
    try {
      setFeedback(null);

      if (Platform.OS !== "web") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          setFeedback(
            permission.canAskAgain
              ? "Necesitamos permiso de cámara para tomar fotografías."
              : "El permiso de cámara está deshabilitado. Actívalo desde la configuración del dispositivo.",
          );

          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],

        allowsEditing: false,

        quality: 1,
      });

      consumeResult(result);
    } catch {
      setFeedback("No se pudo abrir la cámara.");
    }
  };

  /*
   * =======================================================
   * MULTIPLE GALLERY
   * =======================================================
   */

  const handlePickImages = async () => {
    try {
      setFeedback(null);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],

        allowsEditing: false,

        allowsMultipleSelection: true,

        selectionLimit: 0,

        orderedSelection: true,

        quality: 1,
      });

      consumeResult(result);
    } catch {
      setFeedback("No se pudo abrir la galería.");
    }
  };

  /*
   * =======================================================
   * UPDATE
   * =======================================================
   */

  const updateEvidence = (
    id: string,

    patch: Partial<EvidenceQueueItem>,
  ) => {
    setEvidences((current) =>
      current.map((evidence) => {
        if (evidence.id !== id) {
          return evidence;
        }

        return {
          ...evidence,

          ...patch,

          status:
            evidence.status === "error" && patch.status === undefined
              ? "pending"
              : (patch.status ?? evidence.status),
        };
      }),
    );
  };

  /*
   * =======================================================
   * REMOVE
   * =======================================================
   */

  const removeEvidence = (id: string) => {
    if (isBusy) {
      return;
    }

    setEvidences((current) =>
      current
        .filter((evidence) => evidence.id !== id)
        .map((evidence, index) => ({
          ...evidence,

          orden: index,
        })),
    );
  };

  /*
   * =======================================================
   * CLEAR
   * =======================================================
   */

  const clearEvidences = () => {
    if (isBusy) {
      return;
    }

    setEvidences([]);

    setFeedback(null);
  };

  /*
   * =======================================================
   * BATCH UPLOAD
   * =======================================================
   */

  const handleSubmitBatch = async () => {
    if (evidences.length === 0) {
      setFeedback("Selecciona al menos una imagen.");

      return;
    }

    if (evidences.some((evidence) => evidence.tipo === null)) {
      setFeedback("Todas las imágenes deben tener un tipo de evidencia.");

      return;
    }

    const batch = [...evidences];

    const uploadedIds = new Set<string>();

    const failedIds = new Set<string>();

    setFeedback(null);

    setIsSubmittingBatch(true);

    setUploadProgress({
      current: 0,

      total: batch.length,
    });

    for (let index = 0; index < batch.length; index += 1) {
      const evidence = batch[index];

      if (!evidence) {
        continue;
      }

      updateEvidence(
        evidence.id,

        {
          status: "uploading",
        },
      );

      setUploadProgress({
        current: index + 1,

        total: batch.length,
      });

      try {
        await onSubmit({
          file: evidence.file,

          tipo: evidence.tipo!,

          descripcion: evidence.descripcion.trim() || null,

          orden: evidence.orden,
        });

        uploadedIds.add(evidence.id);

        updateEvidence(
          evidence.id,

          {
            status: "success",
          },
        );
      } catch {
        failedIds.add(evidence.id);

        updateEvidence(
          evidence.id,

          {
            status: "error",
          },
        );
      }
    }

    /*
     * Eliminamos las exitosas.
     * Las fallidas permanecen para reintento.
     */

    setEvidences((current) =>
      current
        .filter((evidence) => failedIds.has(evidence.id))
        .map((evidence, index) => ({
          ...evidence,

          orden: index,

          status: "error",
        })),
    );

    setIsSubmittingBatch(false);

    setUploadProgress({
      current: 0,

      total: 0,
    });

    const result: InstallationEvidenceBatchResult = {
      total: batch.length,

      uploaded: uploadedIds.size,

      failed: failedIds.size,
    };

    onBatchComplete?.(result);

    if (failedIds.size === 0) {
      setFeedback(
        uploadedIds.size === 1
          ? "Evidencia subida correctamente."
          : `${uploadedIds.size} evidencias subidas correctamente.`,
      );

      return;
    }

    if (uploadedIds.size === 0) {
      setFeedback(
        "No fue posible subir las evidencias. Las imágenes permanecen disponibles para reintentar.",
      );

      return;
    }

    setFeedback(
      `Se subieron ${uploadedIds.size} de ${batch.length} evidencias. Las imágenes fallidas permanecen disponibles para reintentar.`,
    );
  };

  /*
   * =======================================================
   * CROP MODE
   * =======================================================
   */

  if (currentCropCandidate) {
    return (
      <InstallationEvidenceCropEditor
        candidate={currentCropCandidate}
        current={currentCropNumber}
        total={cropTotal}
        disabled={isBusy}
        onCancel={handleCancelCropQueue}
        onResolve={handleResolveCrop}
      />
    );
  }

  /*
   * =======================================================
   * WORKSPACE
   * =======================================================
   */

  return (
    <AppStack gap="lg">
      {/* ===================================================
          SOURCE
         =================================================== */}

      <AppCard variant="outlined" radius="lg" padding="md">
        <AppStack gap="md">
          <AppInline gap="sm" align="center" justify="space-between" wrap>
            <AppInline gap="sm" align="center">
              <AppIcon icon={Images} size="md" tone="primary" decorative />

              <AppStack gap="xs">
                <AppText variant="titleMedium" weight="semibold">
                  Fotografías
                </AppText>

                <AppText variant="bodySmall" tone="secondary">
                  Selecciona varias imágenes o toma una fotografía.
                </AppText>
              </AppStack>
            </AppInline>

            <AppBadge
              size="sm"
              variant="soft"
              tone={evidences.length > 0 ? "info" : "neutral"}
            >
              {selectedLabel}
            </AppBadge>
          </AppInline>

          <AppGrid gap="sm" minItemWidth={160}>
            <AppButton
              variant="outlined"
              tone="primary"
              leadingIcon={Camera}
              fullWidth
              disabled={isBusy}
              accessibilityLabel="Tomar fotografía con la cámara"
              onPress={() => {
                void handleTakePhoto();
              }}
            >
              Cámara
            </AppButton>

            <AppButton
              variant="outlined"
              tone="neutral"
              leadingIcon={Images}
              fullWidth
              disabled={isBusy}
              accessibilityLabel="Seleccionar varias imágenes de la galería"
              onPress={() => {
                void handlePickImages();
              }}
            >
              Galería
            </AppButton>
          </AppGrid>
        </AppStack>
      </AppCard>

      {/* ===================================================
          FEEDBACK
         =================================================== */}

      {feedback ? (
        <AppCard variant="tonal" radius="md" padding="sm">
          <AppText
            variant="bodySmall"
            tone={
              evidences.some((evidence) => evidence.status === "error")
                ? "danger"
                : "secondary"
            }
          >
            {feedback}
          </AppText>
        </AppCard>
      ) : null}

      {/* ===================================================
          EMPTY
         =================================================== */}

      {evidences.length === 0 ? (
        <AppCard variant="tonal" radius="lg" padding="md">
          <AppStack gap="sm" align="center">
            <AppIcon icon={ImageIcon} size="lg" tone="muted" decorative />

            <AppText variant="bodyMedium" weight="semibold" align="center">
              Sin fotografías preparadas
            </AppText>

            <AppText variant="bodySmall" tone="secondary" align="center">
              Las imágenes que selecciones pasarán primero por el editor de
              recorte.
            </AppText>
          </AppStack>
        </AppCard>
      ) : null}

      {/* ===================================================
          DRAFT HEADER
         =================================================== */}

      {evidences.length > 0 ? (
        <AppInline gap="sm" align="center" justify="space-between" wrap>
          <AppStack gap="xs">
            <AppText variant="titleMedium" weight="semibold">
              Evidencias preparadas
            </AppText>

            <AppText variant="bodySmall" tone="secondary">
              Cada imagen necesita un tipo antes de subirla.
            </AppText>
          </AppStack>

          <AppButton
            size="sm"
            variant="ghost"
            tone="danger"
            leadingIcon={Trash2}
            disabled={isBusy}
            onPress={clearEvidences}
          >
            Limpiar
          </AppButton>
        </AppInline>
      ) : null}

      {/* ===================================================
          DRAFTS
         =================================================== */}

      {evidences.map((evidence, index) => {
        const status = getStatusMeta(evidence.status);

        return (
          <AppCard
            key={evidence.id}
            variant="outlined"
            radius="lg"
            padding="md"
          >
            <AppStack gap="md">
              {/* =======================================
                    PREVIEW
                   ======================================= */}

              <AppInline gap="md" align="flex-start">
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{
                      uri: evidence.file.uri,
                    }}
                    resizeMode="cover"
                    style={styles.thumbnail}
                    accessibilityRole="image"
                    accessibilityLabel={`Vista previa de evidencia ${index + 1}`}
                  />

                  <View style={styles.statusBadge}>
                    <AppBadge size="sm" variant="soft" tone={status.tone}>
                      {status.label}
                    </AppBadge>
                  </View>
                </View>

                <AppStack gap="xs" flex>
                  <AppText
                    variant="bodyMedium"
                    weight="semibold"
                    numberOfLines={2}
                  >
                    {evidence.file.name}
                  </AppText>

                  <AppText variant="bodySmall" tone="secondary">
                    {`Evidencia #${index + 1}`}
                  </AppText>

                  <AppText variant="bodySmall" tone="secondary">
                    {evidence.file.mimeType}
                  </AppText>
                </AppStack>

                <AppButton
                  size="sm"
                  variant="ghost"
                  tone="danger"
                  leadingIcon={Trash2}
                  disabled={isBusy}
                  accessibilityLabel={`Quitar evidencia ${index + 1}`}
                  onPress={() => {
                    removeEvidence(evidence.id);
                  }}
                >
                  Quitar
                </AppButton>
              </AppInline>

              {/* =======================================
                    TYPE
                   ======================================= */}

              <AppSelect
                label="Tipo de evidencia"
                description="Clasifica esta fotografía."
                required
                options={EVIDENCE_TYPE_OPTIONS}
                value={evidence.tipo}
                placeholder="Seleccionar tipo..."
                disabled={isBusy}
                accessibilityLabel={`Tipo de evidencia ${index + 1}`}
                onValueChange={(value) => {
                  updateEvidence(
                    evidence.id,

                    {
                      tipo: value,
                    },
                  );
                }}
              />

              {/* =======================================
                    DESCRIPTION
                   ======================================= */}

              <AppTextArea
                label="Descripción"
                description="Opcional. Describe qué muestra esta imagen."
                placeholder="Ej. ONU instalada y nivel óptico verificado."
                value={evidence.descripcion}
                onChangeText={(value) => {
                  updateEvidence(
                    evidence.id,

                    {
                      descripcion: value,
                    },
                  );
                }}
                minRows={2}
                maxLength={500}
                showCharacterCount
                disabled={isBusy}
                accessibilityLabel={`Descripción de evidencia ${index + 1}`}
              />
            </AppStack>
          </AppCard>
        );
      })}

      {/* ===================================================
          SUBMIT
         =================================================== */}

      {evidences.length > 0 ? (
        <AppCard variant="tonal" radius="lg" padding="md">
          <AppStack gap="sm">
            <AppButton
              size="lg"
              variant="solid"
              tone="primary"
              leadingIcon={Upload}
              fullWidth
              loading={isSubmittingBatch}
              disabled={!canSubmit}
              loadingAccessibilityLabel="Subiendo evidencias"
              accessibilityLabel="Subir evidencias de instalación"
              onPress={() => {
                void handleSubmitBatch();
              }}
            >
              {isSubmittingBatch
                ? `Subiendo ${uploadProgress.current}/${uploadProgress.total}`
                : `Subir ${evidences.length} evidencia${
                    evidences.length === 1 ? "" : "s"
                  }`}
            </AppButton>
          </AppStack>
        </AppCard>
      ) : null}
    </AppStack>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles = StyleSheet.create((theme) => ({
  thumbnailContainer: {
    width: 112,

    height: 112,

    position: "relative",

    flexShrink: 0,

    overflow: "hidden",

    borderRadius: theme.radius.md,

    backgroundColor: theme.colors.surfaceSecondary,
  },

  thumbnail: {
    width: "100%",

    height: "100%",
  },

  statusBadge: {
    position: "absolute",

    top: theme.spacing.xs,

    right: theme.spacing.xs,
  },
}));
