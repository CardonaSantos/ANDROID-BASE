import { View } from 'react-native';
import Svg, {
  Circle,
} from 'react-native-svg';
import {
  StyleSheet,
  useUnistyles,
} from 'react-native-unistyles';

import {
  resolveActionColorTokens,
} from '../../actions/action-colors';
import {
  AppCenter,
  AppStack,
} from '../../layout';
import {
  AppText,
} from '../../primitives';

import type {
  AppProgressProps,
  AppProgressSize,
} from './AppProgress.types';

const circularMetrics = {
  sm: {
    size: 32,
    stroke: 4,
  },

  md: {
    size: 48,
    stroke: 5,
  },

  lg: {
    size: 64,
    stroke: 6,
  },
} as const;

const clamp = (
  value: number,
  min: number,
  max: number,
): number =>
  Math.min(
    max,
    Math.max(min, value),
  );

export const AppProgress = ({
  value,
  min = 0,
  max = 100,
  variant = 'linear',
  size = 'md',
  tone = 'primary',
  showValue = false,
  formatValue = (
    current,
    minimum,
    maximum,
  ) => {
    const span =
      maximum - minimum;

    const percent =
      span <= 0
        ? 0
        : Math.round(
            ((current - minimum) /
              span) *
              100,
          );

    return `${percent}%`;
  },
  accessibilityLabel,
  style,
  testID,
}: AppProgressProps) => {
  const { theme } =
    useUnistyles();

  const safeMax =
    Math.max(min, max);

  const current =
    clamp(
      value,
      min,
      safeMax,
    );

  const span =
    safeMax - min;

  const progress =
    span <= 0
      ? 0
      : (current - min) /
        span;

  const colors =
    resolveActionColorTokens(
      'solid',
      tone,
      false,
    );

  const progressColor =
    colors.container
      ? theme.colors[
          colors.container
        ]
      : theme.colors.primary;

  const valueText =
    formatValue(
      current,
      min,
      safeMax,
    );

  const content =
    variant === 'circular'
      ? (
        <CircularProgress
          progress={progress}
          size={size}
          progressColor={
            progressColor
          }
          trackColor={
            theme.colors
              .surfaceSecondary
          }
          showValue={
            showValue
          }
          valueText={
            valueText
          }
        />
      )
      : (
        <AppStack gap="sm">
          <View
            style={
              styles.linearTrack(
                size,
              )
            }
          >
            <View
              style={[
                styles.linearPart,
                {
                  flexGrow:
                    progress,
                  backgroundColor:
                    progressColor,
                },
              ]}
            />

            <View
              style={[
                styles.linearPart,
                {
                  flexGrow:
                    1 - progress,
                },
              ]}
            />
          </View>

          {showValue ? (
            <AppText
              variant="caption"
              tone="secondary"
              align="right"
              accessible={false}
            >
              {valueText}
            </AppText>
          ) : null}
        </AppStack>
      );

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={
        accessibilityLabel
      }
      accessibilityValue={{
        min,
        max: safeMax,
        now: current,
        text: valueText,
      }}
      testID={testID}
      style={style}
    >
      {content}
    </View>
  );
};

interface CircularProgressProps {
  progress: number;
  size: AppProgressSize;
  progressColor: string;
  trackColor: string;
  showValue: boolean;
  valueText: string;
}

const CircularProgress = ({
  progress,
  size,
  progressColor,
  trackColor,
  showValue,
  valueText,
}: CircularProgressProps) => {
  const metrics =
    circularMetrics[size];

  const center =
    metrics.size / 2;

  const radius =
    center -
    metrics.stroke / 2;

  const circumference =
    2 * Math.PI * radius;

  const dashOffset =
    circumference *
    (1 - progress);

  return (
    <AppCenter>
      <Svg
        width={metrics.size}
        height={metrics.size}
        style={
          styles.circularSvg
        }
      >
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={
            metrics.stroke
          }
        />

        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={
            metrics.stroke
          }
          strokeLinecap="round"
          strokeDasharray={[
            circumference,
            circumference,
          ]}
          strokeDashoffset={
            dashOffset
          }
        />
      </Svg>

      {showValue ? (
        <View
          style={
            styles.circularLabel
          }
        >
          <AppText
            variant={
              size === 'sm'
                ? 'labelSmall'
                : 'labelMedium'
            }
            weight="semibold"
            accessible={false}
          >
            {valueText}
          </AppText>
        </View>
      ) : null}
    </AppCenter>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    linearTrack: (
      size: AppProgressSize,
    ) => ({
      height:
        size === 'sm'
          ? 4
          : size === 'lg'
            ? 8
            : 6,
      width: '100%',
      flexDirection: 'row',
      overflow: 'hidden',
      borderRadius:
        theme.radius.full,
      backgroundColor:
        theme.colors
          .surfaceSecondary,
    }),

    linearPart: {
      flexBasis: 0,
      height: '100%',
    },

    circularSvg: {
      transform: [
        {
          rotate: '-90deg',
        },
      ],
    },

    circularLabel: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);
