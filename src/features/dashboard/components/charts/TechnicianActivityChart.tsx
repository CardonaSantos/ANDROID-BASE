import { Fragment, useMemo, useState, type ReactNode } from "react";

import {
  Pressable,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";

import { Activity } from "lucide-react-native";

import { useUnistyles } from "react-native-unistyles";

import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";

import {
  AppCard,
  AppIcon,
  AppInline,
  AppStack,
  AppText,
} from "@/design-system";
import { TechnicianPanelActivityDay } from "../../api";

/*
 * =========================================================
 * GEOMETRÍA
 * =========================================================
 */

const CHART_HEIGHT = 230;

const CHART_MARGIN = {
  top: 12,

  right: 10,

  bottom: 34,

  left: 32,
} as const;

const DESIRED_Y_INTERVALS = 4;

const APPROXIMATE_X_LABEL_WIDTH = 62;

interface TechnicianActivityChartProps {
  activity: TechnicianPanelActivityDay[];
}

interface ChartScale {
  max: number;

  step: number;

  ticks: number[];
}

function createChartScale(maxValue: number): ChartScale {
  /*
   * Siempre dejamos al menos una unidad
   * visible aunque todo el período esté
   * todavía en cero.
   */
  if (maxValue <= DESIRED_Y_INTERVALS) {
    const max = Math.max(DESIRED_Y_INTERVALS, maxValue);

    return {
      max,

      step: 1,

      ticks: Array.from(
        {
          length: max + 1,
        },
        (_, index) => index,
      ),
    };
  }

  const rawStep = maxValue / DESIRED_Y_INTERVALS;

  const magnitude = 10 ** Math.floor(Math.log10(rawStep));

  const normalized = rawStep / magnitude;

  let niceNormalized: number;

  if (normalized <= 1) {
    niceNormalized = 1;
  } else if (normalized <= 2) {
    niceNormalized = 2;
  } else if (normalized <= 5) {
    niceNormalized = 5;
  } else {
    niceNormalized = 10;
  }

  const step = niceNormalized * magnitude;

  const max = Math.ceil(maxValue / step) * step;

  const ticks = Array.from(
    {
      length: Math.round(max / step) + 1,
    },
    (_, index) => index * step,
  );

  return {
    max,
    step,
    ticks,
  };
}

/*
 * Recharts usa minTickGap para no mostrar
 * los 31 labels del mes simultáneamente.
 *
 * Aquí conseguimos el mismo objetivo
 * calculando cuántas etiquetas caben
 * aproximadamente en el ancho disponible.
 */
function getVisibleLabelIndexes(
  itemCount: number,
  plotWidth: number,
): number[] {
  if (itemCount <= 0) {
    return [];
  }

  if (itemCount === 1) {
    return [0];
  }

  const maximumLabels = Math.max(
    2,
    Math.floor(plotWidth / APPROXIMATE_X_LABEL_WIDTH) + 1,
  );

  const visibleCount = Math.min(itemCount, maximumLabels);

  if (visibleCount === itemCount) {
    return Array.from(
      {
        length: itemCount,
      },
      (_, index) => index,
    );
  }

  const indexes = new Set<number>();

  for (let position = 0; position < visibleCount; position += 1) {
    indexes.add(Math.round((position * (itemCount - 1)) / (visibleCount - 1)));
  }

  return [...indexes].sort((left, right) => left - right);
}

function LegendItem({
  label,
  color,
  dashed = false,
}: {
  label: string;

  color: string;

  dashed?: boolean;
}) {
  return (
    <AppInline gap="xs" align="center">
      <Svg width={20} height={8}>
        <Line
          x1={1}
          y1={4}
          x2={19}
          y2={4}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={dashed ? "4 4" : undefined}
          strokeLinecap="round"
        />
      </Svg>

      <AppText variant="labelSmall" tone="muted">
        {label}
      </AppText>
    </AppInline>
  );
}

export function TechnicianActivityChart({
  activity,
}: TechnicianActivityChartProps) {
  const { theme } = useUnistyles();

  const [width, setWidth] = useState(0);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const hasActivity = activity.some((item) => item.total > 0);

  const maxValue = useMemo(
    () =>
      activity.reduce(
        (current, item) => Math.max(current, item.tickets, item.instalaciones),
        0,
      ),
    [activity],
  );

  const scale = useMemo(() => createChartScale(maxValue), [maxValue]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);

    if (nextWidth > 0 && nextWidth !== width) {
      setWidth(nextWidth);
    }
  };

  const handleChartPress = (event: GestureResponderEvent) => {
    if (activity.length === 0 || width <= 0) {
      return;
    }

    if (activity.length === 1) {
      setSelectedIndex(0);
      return;
    }

    const plotWidth = Math.max(
      1,
      width - CHART_MARGIN.left - CHART_MARGIN.right,
    );

    /*
     * El Pressable ocupa solamente el área
     * horizontal real del gráfico, por lo
     * que locationX ya viene relativo al
     * plot y no al SVG completo.
     */
    const locationX = Math.max(
      0,
      Math.min(event.nativeEvent.locationX, plotWidth),
    );

    const relativePosition = locationX / plotWidth;

    const nextIndex = Math.round(relativePosition * (activity.length - 1));

    setSelectedIndex(Math.max(0, Math.min(nextIndex, activity.length - 1)));
  };
  /*
   * El elemento seleccionado se deriva
   * defensivamente para soportar un
   * refetch que cambie actividadDiaria.
   */
  const selectedDay =
    selectedIndex !== null &&
    selectedIndex >= 0 &&
    selectedIndex < activity.length
      ? activity[selectedIndex]
      : null;

  const renderChart = width > 0 && activity.length > 0;

  let chartContent: ReactNode = null;
  if (renderChart) {
    const plotWidth = Math.max(
      1,
      width - CHART_MARGIN.left - CHART_MARGIN.right,
    );

    const plotHeight = CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom;

    const chartBottom = CHART_MARGIN.top + plotHeight;

    const chartRight = CHART_MARGIN.left + plotWidth;

    const xForIndex = (index: number) => {
      if (activity.length === 1) {
        return CHART_MARGIN.left + plotWidth / 2;
      }

      return CHART_MARGIN.left + (index / (activity.length - 1)) * plotWidth;
    };

    const yForValue = (value: number) =>
      CHART_MARGIN.top + plotHeight - (value / scale.max) * plotHeight;

    const installationPoints = activity
      .map(
        (item, index) => `${xForIndex(index)},${yForValue(item.instalaciones)}`,
      )
      .join(" ");

    const ticketPoints = activity
      .map((item, index) => `${xForIndex(index)},${yForValue(item.tickets)}`)
      .join(" ");

    const labelIndexes = getVisibleLabelIndexes(activity.length, plotWidth);

    chartContent = (
      <Svg width={width} height={CHART_HEIGHT}>
        {/* ===================================== */}
        {/* GRID / EJE Y */}
        {/* ===================================== */}

        {scale.ticks.map((tick) => {
          const y = yForValue(tick);

          return (
            <Fragment key={`y-${tick}`}>
              <Line
                x1={CHART_MARGIN.left}
                y1={y}
                x2={chartRight}
                y2={y}
                stroke={theme.colors.border}
                strokeWidth={1}
                strokeOpacity={0.55}
                strokeDasharray="3 3"
              />

              <SvgText
                x={CHART_MARGIN.left - 7}
                y={y + 3.5}
                fill={theme.colors.textMuted}
                fontSize={10}
                textAnchor="end"
              >
                {tick}
              </SvgText>
            </Fragment>
          );
        })}

        {/* ===================================== */}
        {/* EJE X */}
        {/* ===================================== */}

        {labelIndexes.map((index) => {
          const item = activity[index];

          const x = xForIndex(index);

          const isFirst = index === 0;

          const isLast = index === activity.length - 1;

          return (
            <SvgText
              key={`x-${item.fecha}-${index}`}
              x={x}
              y={chartBottom + 22}
              fill={theme.colors.textMuted}
              fontSize={10}
              textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
            >
              {item.etiqueta}
            </SvgText>
          );
        })}

        {/* ===================================== */}
        {/* INSTALACIONES */}
        {/* ===================================== */}

        {activity.length > 1 ? (
          <Polyline
            points={installationPoints}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}

        {/* ===================================== */}
        {/* TICKETS */}
        {/* ===================================== */}

        {activity.length > 1 ? (
          <Polyline
            points={ticketPoints}
            fill="none"
            stroke={theme.colors.text}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}

        {/* ===================================== */}
        {/* ÚNICO PUNTO */}
        {/* ===================================== */}

        {activity.length === 1 ? (
          <>
            <Circle
              cx={xForIndex(0)}
              cy={yForValue(activity[0].instalaciones)}
              r={3.5}
              fill={theme.colors.primary}
            />

            <Circle
              cx={xForIndex(0)}
              cy={yForValue(activity[0].tickets)}
              r={3}
              fill={theme.colors.text}
            />
          </>
        ) : null}

        {/* ===================================== */}
        {/* SELECCIÓN */}
        {/* ===================================== */}

        {selectedDay && selectedIndex !== null ? (
          <>
            <Line
              x1={xForIndex(selectedIndex)}
              y1={CHART_MARGIN.top}
              x2={xForIndex(selectedIndex)}
              y2={chartBottom}
              stroke={theme.colors.borderStrong}
              strokeWidth={1}
              strokeDasharray="3 3"
            />

            <Circle
              cx={xForIndex(selectedIndex)}
              cy={yForValue(selectedDay.instalaciones)}
              r={4}
              fill={theme.colors.primary}
            />

            <Circle
              cx={xForIndex(selectedIndex)}
              cy={yForValue(selectedDay.tickets)}
              r={3.5}
              fill={theme.colors.text}
            />
          </>
        ) : null}
      </Svg>
    );
  }

  return (
    <AppCard variant="outlined" radius="md" padding="md">
      <AppStack gap="lg">
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <AppInline gap="md" align="flex-start" justify="space-between" wrap>
          <AppStack gap="xxs" flex>
            <AppInline gap="sm" align="center">
              <AppIcon icon={Activity} size="sm" tone="default" decorative />

              <AppText variant="titleSmall" weight="semibold">
                Actividad del mes
              </AppText>
            </AppInline>

            <AppText variant="bodySmall" tone="muted">
              Trabajos completados por día
            </AppText>
          </AppStack>

          <AppInline gap="md" align="center" wrap>
            <LegendItem label="Instalaciones" color={theme.colors.primary} />

            <LegendItem label="Tickets" color={theme.colors.text} dashed />
          </AppInline>
        </AppInline>

        {/* ========================================= */}
        {/* CHART */}
        {/* ========================================= */}

        {activity.length > 0 ? (
          <View
            onLayout={handleLayout}
            style={{
              width: "100%",
              minHeight: CHART_HEIGHT,
              position: "relative",
            }}
          >
            {chartContent}

            {width > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Seleccionar día de actividad"
                onPress={handleChartPress}
                style={{
                  position: "absolute",
                  top: CHART_MARGIN.top,
                  left: CHART_MARGIN.left,
                  right: CHART_MARGIN.right,
                  height: CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom,
                }}
              />
            ) : null}
          </View>
        ) : (
          <AppText variant="bodySmall" tone="muted">
            Sin información de actividad para este período.
          </AppText>
        )}

        {/* ========================================= */}
        {/* DETALLE DEL DÍA SELECCIONADO */}
        {/* ========================================= */}

        {selectedDay ? (
          <AppCard variant="tonal" radius="md" padding="sm">
            <AppInline gap="md" align="flex-start" justify="space-between">
              <AppStack gap="xs" flex>
                <AppText variant="labelSmall" tone="muted">
                  DÍA SELECCIONADO
                </AppText>

                <AppText variant="titleSmall" weight="semibold">
                  {selectedDay.etiqueta}
                </AppText>

                <AppText variant="bodySmall" tone="muted">
                  {`${selectedDay.tickets} ${
                    selectedDay.tickets === 1 ? "ticket" : "tickets"
                  } · ${selectedDay.instalaciones} ${
                    selectedDay.instalaciones === 1
                      ? "instalación"
                      : "instalaciones"
                  }`}
                </AppText>
              </AppStack>

              <AppText variant="titleMedium" weight="semibold">
                {selectedDay.total}
              </AppText>
            </AppInline>
          </AppCard>
        ) : null}

        {/* ========================================= */}
        {/* EMPTY ACTIVITY */}
        {/* ========================================= */}

        {!hasActivity && activity.length > 0 ? (
          <AppText
            variant="bodySmall"
            tone="muted"
            style={{
              textAlign: "center",
            }}
          >
            Aún no hay trabajos completados durante este período.
          </AppText>
        ) : null}
      </AppStack>
    </AppCard>
  );
}
