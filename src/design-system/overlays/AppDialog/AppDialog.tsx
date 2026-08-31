import { Modal, Pressable, ScrollView, View } from "react-native";

import { X } from "lucide-react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StyleSheet } from "react-native-unistyles";

import { AppIconButton } from "../../actions";

import type { ComponentTone } from "../../contracts";

import { useControllableState } from "../../hooks";

import { AppInline, AppStack } from "../../layout";

import { AppIcon, AppSurface, AppText } from "../../primitives";

import { spacing } from "../../tokens";

import { resolveToneContainerColor } from "../../utils";

import { overlayCopy } from "../overlay.copy";

import type { AppDialogProps, AppDialogSize } from "./AppDialog.types";

const dialogWidth = {
  sm: 400,
  md: 560,
  lg: 720,
} as const;

const iconContentToken = (
  tone: ComponentTone,
):
  | "text"
  | "onPrimaryContainer"
  | "onSuccessContainer"
  | "onWarningContainer"
  | "onDangerContainer"
  | "onInfoContainer" => {
  switch (tone) {
    case "primary":
      return "onPrimaryContainer";

    case "success":
      return "onSuccessContainer";

    case "warning":
      return "onWarningContainer";

    case "danger":
      return "onDangerContainer";

    case "info":
      return "onInfoContainer";

    case "neutral":
    default:
      return "text";
  }
};

export const AppDialog = ({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  icon,
  children,
  actions,
  tone = "neutral",
  size = "md",
  dismissable = true,
  showCloseButton = true,
  closeAccessibilityLabel = overlayCopy.dialog.close,
  scrollable = false,
  style,
  contentStyle,
  testID,
}: AppDialogProps) => {
  const insets = useSafeAreaInsets();

  const controlled = open !== undefined;

  const [isOpen, setOpen] = useControllableState<boolean>(
    controlled
      ? {
          value: open ?? false,
          defaultValue: defaultOpen,
          onValueChange: onOpenChange,
        }
      : {
          defaultValue: defaultOpen,
          onValueChange: onOpenChange,
        },
  );

  const close = () => {
    if (dismissable) {
      setOpen(false);
    }
  };

  const body = <AppStack gap="lg">{children}</AppStack>;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      hardwareAccelerated
      statusBarTranslucent
      navigationBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={close}
      testID={testID}
    >
      <View
        style={[
          styles.root,
          {
            paddingTop: insets.top + spacing.lg,

            paddingRight: insets.right + spacing.lg,

            paddingBottom: insets.bottom + spacing.lg,

            paddingLeft: insets.left + spacing.lg,
          },
        ]}
      >
        <Pressable
          accessible={dismissable}
          accessibilityRole={dismissable ? "button" : undefined}
          accessibilityLabel={dismissable ? closeAccessibilityLabel : undefined}
          onPress={close}
          style={styles.backdrop}
        />

        <View
          pointerEvents="box-none"
          accessibilityViewIsModal
          importantForAccessibility="yes"
          style={styles.center}
        >
          <AppSurface
            variant="elevated"
            radius="xl"
            padding="none"
            elevation="high"
            style={[styles.dialog(size), style]}
          >
            <AppStack gap="none" style={styles.dialogLayout}>
              {title || description || icon || showCloseButton ? (
                <View style={styles.header}>
                  <AppInline gap="md" align="flex-start">
                    {icon ? (
                      <View style={styles.icon(tone)}>
                        <AppIcon
                          icon={icon}
                          size="lg"
                          colorToken={iconContentToken(tone)}
                          decorative
                        />
                      </View>
                    ) : null}

                    <AppStack gap="xs" flex style={styles.headerText}>
                      {title ? (
                        typeof title === "string" ||
                        typeof title === "number" ? (
                          <AppText
                            variant="titleLarge"
                            accessibilityRole="header"
                            weight="semibold"
                          >
                            {title}
                          </AppText>
                        ) : (
                          title
                        )
                      ) : null}

                      {description ? (
                        typeof description === "string" ||
                        typeof description === "number" ? (
                          <AppText variant="bodyMedium" tone="secondary">
                            {description}
                          </AppText>
                        ) : (
                          description
                        )
                      ) : null}
                    </AppStack>

                    {showCloseButton ? (
                      <AppIconButton
                        icon={X}
                        size="sm"
                        variant="ghost"
                        tone="neutral"
                        interaction="subtle"
                        accessibilityLabel={closeAccessibilityLabel}
                        onPress={() => {
                          setOpen(false);
                        }}
                      />
                    ) : null}
                  </AppInline>
                </View>
              ) : null}

              {children ? (
                scrollable ? (
                  <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[styles.content, contentStyle]}
                    keyboardShouldPersistTaps="handled"
                  >
                    {body}
                  </ScrollView>
                ) : (
                  <View style={[styles.content, contentStyle]}>{body}</View>
                )
              ) : null}

              {actions ? <View style={styles.actions}>{actions}</View> : null}
            </AppStack>
          </AppSurface>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    justifyContent: "center",
  },

  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.colors.scrim,
  },

  center: {
    width: "100%",

    minHeight: 0,

    flexShrink: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  dialog: (size: AppDialogSize) => ({
    width: "100%",

    maxWidth: dialogWidth[size],

    /*
     * Nunca permitimos que el diálogo
     * se salga del viewport.
     */
    maxHeight: "90%",

    minHeight: 0,

    overflow: "hidden",

    backgroundColor: theme.colors.surfaceElevated,
  }),

  /*
   * Es importante que header, body y
   * actions compartan correctamente
   * el espacio disponible.
   */
  dialogLayout: {
    minHeight: 0,

    maxHeight: "100%",
  },

  header: {
    flexShrink: 0,

    paddingTop: theme.spacing.xl,

    paddingHorizontal: theme.spacing.xl,
  },

  headerText: {
    minWidth: 0,
  },

  icon: (tone: ComponentTone) => ({
    width: 44,
    height: 44,

    flexShrink: 0,

    alignItems: "center",

    justifyContent: "center",

    borderRadius: theme.radius.full,

    backgroundColor: resolveToneContainerColor(theme, tone),
  }),

  scroll: {
    /*
     * El body es la única sección
     * que puede ceder espacio.
     *
     * Header y actions permanecen
     * visibles.
     */
    minHeight: 0,

    flexShrink: 1,

    maxHeight: 520,
  },

  content: {
    paddingTop: theme.spacing.lg,

    paddingHorizontal: theme.spacing.xl,

    paddingBottom: theme.spacing.xl,
  },

  actions: {
    /*
     * Los botones nunca deben ser
     * aplastados por contenido grande.
     */
    flexShrink: 0,

    paddingHorizontal: theme.spacing.xl,

    paddingBottom: theme.spacing.xl,
  },
}));
