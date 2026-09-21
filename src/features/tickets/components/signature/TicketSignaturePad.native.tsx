import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { PanResponder, View } from "react-native";

import Svg, { Path } from "react-native-svg";

import { captureRef } from "react-native-view-shot";

import { Eraser } from "lucide-react-native";

import { StyleSheet } from "react-native-unistyles";

import {
  AppButton,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";

import type {
  TicketSignaturePadHandle,
  TicketSignaturePadProps,
} from "./TicketSignaturePad.types";

interface SignaturePoint {
  x: number;
  y: number;
}

type SignatureStroke = SignaturePoint[];

/*
 * Colores documentales intencionalmente fijos.
 *
 * A diferencia del chrome de la aplicación, la firma se almacena como un
 * artefacto visual que debe seguir siendo legible independientemente del
 * tema claro/oscuro con el que fue capturada.
 */
const SIGNATURE_PAPER = "#FFFFFF";
const SIGNATURE_INK = "#111827";

function strokeToPath(points: SignatureStroke): string {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    const point = points[0];
    return `M ${point.x} ${point.y} L ${point.x + 0.1} ${point.y + 0.1}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];

    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;

    path += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
  }

  const last = points[points.length - 1];
  path += ` L ${last.x} ${last.y}`;

  return path;
}

export const TicketSignaturePad = forwardRef<
  TicketSignaturePadHandle,
  TicketSignaturePadProps
>(function TicketSignaturePad(
  {
    disabled = false,
    invalid = false,
    error,
    description = "Firme dentro del recuadro utilizando el dedo o un lápiz táctil.",
    onEmptyChange,
  },
  ref,
) {
  const captureViewRef = useRef<View>(null);

  const [strokes, setStrokes] = useState<SignatureStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<SignatureStroke>([]);

  const strokesRef = useRef<SignatureStroke[]>([]);
  const currentStrokeRef = useRef<SignatureStroke>([]);
  const emptyRef = useRef(true);
  const onEmptyChangeRef = useRef(onEmptyChange);

  useEffect(() => {
    onEmptyChangeRef.current = onEmptyChange;
  }, [onEmptyChange]);

  const syncEmptyState = useCallback((isEmpty: boolean) => {
    if (emptyRef.current === isEmpty) {
      return;
    }

    emptyRef.current = isEmpty;
    onEmptyChangeRef.current?.(isEmpty);
  }, []);

  const setCurrent = useCallback((next: SignatureStroke) => {
    currentStrokeRef.current = next;
    setCurrentStroke(next);
    syncEmptyState(next.length === 0 && strokesRef.current.length === 0);
  }, [syncEmptyState]);

  const commitCurrentStroke = useCallback(() => {
    const current = currentStrokeRef.current;

    if (current.length === 0) {
      return;
    }

    const nextStrokes = [...strokesRef.current, current];

    strokesRef.current = nextStrokes;
    currentStrokeRef.current = [];

    setStrokes(nextStrokes);
    setCurrentStroke([]);

    syncEmptyState(false);
  }, [syncEmptyState]);

  const clear = useCallback(() => {
    strokesRef.current = [];
    currentStrokeRef.current = [];

    setStrokes([]);
    setCurrentStroke([]);

    syncEmptyState(true);
  }, [syncEmptyState]);

  const isEmpty = useCallback(() => {
    return strokesRef.current.length === 0 && currentStrokeRef.current.length === 0;
  }, []);

  const captureFile = useCallback(
    async (options?: { fileName?: string }) => {
      if (isEmpty() || !captureViewRef.current) {
        return null;
      }

      const uri = await captureRef(captureViewRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      return {
        uri,
        name: options?.fileName ?? "firma.png",
        mimeType: "image/png",
      };
    },
    [isEmpty],
  );

  useImperativeHandle(
    ref,
    () => ({
      clear,
      isEmpty,
      captureFile,
    }),
    [captureFile, clear, isEmpty],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onStartShouldSetPanResponderCapture: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponderCapture: () => !disabled,

        onPanResponderGrant: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          setCurrent([{ x: locationX, y: locationY }]);
        },

        onPanResponderMove: (event) => {
          const { locationX, locationY } = event.nativeEvent;
          const previous = currentStrokeRef.current;
          const last = previous[previous.length - 1];

          if (last) {
            const dx = locationX - last.x;
            const dy = locationY - last.y;

            /*
             * Reduce puntos redundantes y evita re-renderizar por micro-movimientos.
             */
            if (dx * dx + dy * dy < 2.25) {
              return;
            }
          }

          setCurrent([...previous, { x: locationX, y: locationY }]);
        },

        onPanResponderRelease: commitCurrentStroke,
        onPanResponderTerminate: commitCurrentStroke,
        onPanResponderTerminationRequest: () => false,
      }),
    [commitCurrentStroke, disabled, setCurrent],
  );

  const isCurrentlyEmpty = strokes.length === 0 && currentStroke.length === 0;

  return (
    <AppStack gap="sm">
      <AppInline gap="sm" align="center" justify="space-between">
        <AppText variant="bodySmall" tone="secondary" style={styles.description}>
          {description}
        </AppText>

        <AppButton
          size="sm"
          variant="soft"
          tone="neutral"
          leadingIcon={Eraser}
          disabled={disabled || isCurrentlyEmpty}
          accessibilityLabel="Limpiar firma"
          onPress={clear}
        >
          Limpiar
        </AppButton>
      </AppInline>

      <View
          ref={captureViewRef}
          collapsable={false}
          accessible
          accessibilityRole="image"
          accessibilityLabel={
            isCurrentlyEmpty
              ? "Área de firma vacía"
              : "Firma manuscrita capturada"
          }
          {...panResponder.panHandlers}
          style={[
            styles.paper,
            invalid ? styles.paperInvalid : null,
            disabled ? styles.paperDisabled : null,
          ]}
        >
          <Svg width="100%" height="100%">
            {strokes.map((stroke, index) => (
              <Path
                key={`stroke-${index}`}
                d={strokeToPath(stroke)}
                fill="none"
                stroke={SIGNATURE_INK}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {currentStroke.length > 0 ? (
              <Path
                d={strokeToPath(currentStroke)}
                fill="none"
                stroke={SIGNATURE_INK}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </Svg>

          {isCurrentlyEmpty ? (
            <View pointerEvents="none" style={styles.placeholder}>
              <AppText variant="titleMedium" weight="semibold" tone="muted" align="center">
                Firme aquí
              </AppText>

              <AppText variant="bodySmall" tone="muted" align="center">
                Use el dedo o un lápiz táctil
              </AppText>
            </View>
          ) : null}
      </View>

      {invalid && error ? (
        <AppText variant="bodySmall" tone="danger" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
    </AppStack>
  );
});

TicketSignaturePad.displayName = "TicketSignaturePad";

const styles = StyleSheet.create((theme) => ({
  description: {
    flex: 1,
  },

  paper: {
    position: "relative",
    width: "100%",
    height: 320,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    backgroundColor: SIGNATURE_PAPER,
  },

  paperInvalid: {
    borderColor: theme.colors.danger,
  },

  paperDisabled: {
    opacity: theme.opacity.disabledContent,
  },

  placeholder: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
}));
