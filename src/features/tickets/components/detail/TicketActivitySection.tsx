import {
  ChevronDown,
  ChevronUp,
  History,
  MessageSquareText,
  Send,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
  AppDivider,
  AppIcon,
  AppInline,
  AppSectionHeader,
  AppStack,
  AppText,
  AppTextArea,
} from "@/design-system";

import type {
  TicketComment,
  TicketHistoryItem,
} from "../../api/tickets.contracts.api";

import {
  buildTicketActivityItems,
  formatTicketDate,
  getTicketHistoryLabel,
} from "../../tickets.helpers";

export interface TicketActivitySectionProps {
  comments: readonly TicketComment[];
  history: readonly TicketHistoryItem[];
  isSubmitting?: boolean;
  onSubmit: (text: string) => void | Promise<void>;
}

function TicketCommentRow({ comment }: { comment: TicketComment }) {
  const avatarSource = comment.usuario.avatarUrl
    ? { uri: comment.usuario.avatarUrl }
    : undefined;

  return (
    <AppInline gap="sm" align="flex-start">
      <AppAvatar
        size="sm"
        name={comment.usuario.nombre}
        source={avatarSource}
        tone="primary"
        decorative
      />

      <AppStack gap="xs" flex>
        <AppInline gap="xs" align="center" justify="space-between" wrap>
          <AppStack gap="xs" flex>
            <AppText variant="bodySmall" weight="semibold" numberOfLines={1}>
              {comment.usuario.nombre}
            </AppText>

            <AppText variant="labelSmall" tone="secondary">
              {comment.usuario.rol.replace(/_/g, " ")}
            </AppText>
          </AppStack>

          <AppText variant="labelSmall" tone="secondary">
            {formatTicketDate(comment.fechaRegistro)}
          </AppText>
        </AppInline>

        <AppText variant="bodyMedium">{comment.descripcion}</AppText>
      </AppStack>
    </AppInline>
  );
}

interface TicketHistoryRowProps {
  history: TicketHistoryItem;
  expanded: boolean;
  onToggle: () => void;
}

function TicketHistoryRow({
  history,
  expanded,
  onToggle,
}: TicketHistoryRowProps) {
  const avatarSource = history.actor.avatarUrl
    ? { uri: history.actor.avatarUrl }
    : undefined;

  return (
    <AppInline gap="sm" align="flex-start">
      <AppAvatar
        size="sm"
        name={history.actor.nombre}
        source={avatarSource}
        tone={history.actor.usuarioId ? "info" : "neutral"}
        fallback={
          history.actor.usuarioId === null ? (
            <AppIcon icon={History} size="sm" tone="muted" decorative />
          ) : undefined
        }
        decorative
      />

      <AppStack gap="xs" flex>
        <AppInline gap="xs" align="center" justify="space-between" wrap>
          <AppText variant="bodySmall" weight="semibold" numberOfLines={1}>
            {history.actor.nombre}
          </AppText>

          <AppText variant="labelSmall" tone="secondary">
            {formatTicketDate(history.creadoEn)}
          </AppText>
        </AppInline>

        <AppCard
          variant="tonal"
          radius="md"
          padding="sm"
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={`${getTicketHistoryLabel(history.tipo)}. ${
            expanded ? "Ocultar detalle" : "Mostrar detalle"
          }`}
        >
          <AppStack gap="xs">
            <AppInline gap="xs" align="center" justify="space-between">
              <AppInline gap="xs" align="center" flex>
                <AppIcon icon={History} size="sm" tone="primary" decorative />

                <AppText
                  variant="bodySmall"
                  weight="semibold"
                  numberOfLines={1}
                >
                  {getTicketHistoryLabel(history.tipo)}
                </AppText>
              </AppInline>

              <AppIcon
                icon={expanded ? ChevronUp : ChevronDown}
                size="sm"
                tone="muted"
                decorative
              />
            </AppInline>

            {expanded ? (
              <AppText variant="bodySmall" tone="secondary">
                {history.descripcion || "Cambio registrado en el ticket."}
              </AppText>
            ) : null}
          </AppStack>
        </AppCard>
      </AppStack>
    </AppInline>
  );
}

export function TicketActivitySection({
  comments,
  history,
  isSubmitting = false,
  onSubmit,
}: TicketActivitySectionProps) {
  const [commentText, setCommentText] = useState("");

  const [expandedHistoryIds, setExpandedHistoryIds] = useState<Set<number>>(
    () => new Set(),
  );

  const activityItems = useMemo(
    () => buildTicketActivityItems(comments, history),
    [comments, history],
  );

  const normalizedComment = commentText.trim();
  const canSubmit = normalizedComment.length > 0 && !isSubmitting;

  const toggleHistory = (historyId: number) => {
    setExpandedHistoryIds((current) => {
      const next = new Set(current);

      if (next.has(historyId)) {
        next.delete(historyId);
      } else {
        next.add(historyId);
      }

      return next;
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    try {
      await onSubmit(normalizedComment);
      setCommentText("");
    } catch {
      // La pantalla muestra el feedback y conservamos el texto escrito.
    }
  };

  const styles = StyleSheet.create((theme) => ({
    activityViewport: {
      maxHeight: 340,
    },

    activityContent: {
      paddingRight: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
    },
  }));

  return (
    <AppCard variant="outlined" radius="lg" padding="md">
      <AppStack gap="md">
        <AppSectionHeader
          size="sm"
          title="Actividad del ticket"
          description=""
          leading={
            <AppIcon
              icon={MessageSquareText}
              size="md"
              tone="primary"
              decorative
            />
          }
        />

        <AppInline gap="xs" align="center" wrap>
          <AppBadge size="sm" tone="primary" variant="soft">
            {comments.length === 1
              ? "1 comentario"
              : `${comments.length} comentarios`}
          </AppBadge>

          <AppBadge size="sm" tone="info" variant="soft">
            {history.length === 1 ? "1 cambio" : `${history.length} cambios`}
          </AppBadge>
        </AppInline>

        <AppDivider />

        {activityItems.length > 0 ? (
          <ScrollView
            style={styles.activityViewport}
            contentContainerStyle={styles.activityContent}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            <AppStack gap="sm">
              {activityItems.map((item, index) => (
                <AppStack key={item.id} gap="sm">
                  {item.kind === "comment" ? (
                    <TicketCommentRow comment={item.comment} />
                  ) : (
                    <TicketHistoryRow
                      history={item.history}
                      expanded={expandedHistoryIds.has(item.history.id)}
                      onToggle={() => {
                        toggleHistory(item.history.id);
                      }}
                    />
                  )}

                  {index < activityItems.length - 1 ? (
                    <AppDivider insetStart="lg" />
                  ) : null}
                </AppStack>
              ))}
            </AppStack>
          </ScrollView>
        ) : (
          <AppText variant="bodySmall" tone="secondary">
            Aún no hay comentarios ni cambios registrados para este ticket.
          </AppText>
        )}

        <AppDivider />

        <AppStack gap="sm">
          <AppTextArea
            size="sm"
            minRows={2}
            maxLength={2000}
            label="Seguimiento"
            placeholder="Comentario"
            value={commentText}
            onChangeText={setCommentText}
            disabled={isSubmitting}
            accessibilityLabel="Comentario de seguimiento del ticket"
          />

          <AppInline justify="flex-end">
            <AppButton
              size="sm"
              variant="solid"
              tone="primary"
              leadingIcon={Send}
              loading={isSubmitting}
              loadingAccessibilityLabel="Enviando comentario"
              disabled={!canSubmit}
              onPress={() => {
                void handleSubmit();
              }}
            >
              Enviar
            </AppButton>
          </AppInline>
        </AppStack>
      </AppStack>
    </AppCard>
  );
}
