import {
  useEffect,
} from 'react';
import {
  ChevronDown,
} from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import {
  appHaptics,
} from '../../haptics';
import {
  useControllableState,
} from '../../hooks';
import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  timingPresets,
} from '../../motion';
import {
  AppIcon,
  AppPressable,
  AppSurface,
  AppText,
} from '../../primitives';
import {
  motion,
} from '../../tokens';

import type {
  AppAccordionProps,
} from './AppAccordion.types';

const accordionLayout =
  LinearTransition
    .duration(
      motion.duration.normal,
    )
    .reduceMotion(
      ReduceMotion.System,
    );

const contentEntering =
  FadeIn
    .duration(
      motion.duration.fast,
    )
    .reduceMotion(
      ReduceMotion.System,
    );

const contentExiting =
  FadeOut
    .duration(
      motion.duration.fast,
    )
    .reduceMotion(
      ReduceMotion.System,
    );

export const AppAccordion = ({
  title,
  children,
  description,
  leading,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  disabled = false,
  variant = 'outlined',
  tone = 'neutral',
  accessibilityLabel,
  style,
  contentStyle,
  testID,
}: AppAccordionProps) => {
  const controlled =
    expanded !== undefined;

  const [
    isExpanded,
    setExpanded,
  ] =
    useControllableState<boolean>(
      controlled
        ? {
            value:
              expanded ?? false,
            defaultValue:
              defaultExpanded,
            onValueChange:
              onExpandedChange,
          }
        : {
            defaultValue:
              defaultExpanded,
            onValueChange:
              onExpandedChange,
          },
    );

  const rotation =
    useSharedValue(
      isExpanded ? 1 : 0,
    );

  useEffect(() => {
    rotation.value =
      withTiming(
        isExpanded ? 1 : 0,
        timingPresets.standard,
      );
  }, [
    isExpanded,
    rotation,
  ]);

  const chevronStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          rotate:
            `${rotation.value * 180}deg`,
        },
      ],
    }));

  const resolvedLabel =
    accessibilityLabel ??
    (typeof title === 'string' ||
    typeof title === 'number'
      ? String(title)
      : undefined);

  return (
    <Animated.View
      layout={accordionLayout}
      style={style}
    >
      <AppSurface
        variant={variant}
        tone={tone}
        radius="lg"
        padding="none"
      >
        <AppPressable
          accessibilityRole="button"
          accessibilityLabel={
            resolvedLabel
          }
          accessibilityState={{
            expanded:
              isExpanded,
            disabled,
          }}
          disabled={disabled}
          interaction="subtle"
          haptic={false}
          radius="lg"
          stateLayerColorToken="text"
          onPress={() => {
            const next =
              !isExpanded;

            setExpanded(next);
            void appHaptics.selection();
          }}
          testID={testID}
          style={styles.header}
        >
          <AppInline
            gap="md"
            align="center"
          >
            {leading ? (
              leading
            ) : null}

            <AppStack
              gap="xxs"
              flex
            >
              {typeof title ===
                'string' ||
              typeof title ===
                'number' ? (
                <AppText
                  variant="bodyLarge"
                  weight="medium"
                  tone={
                    disabled
                      ? 'disabled'
                      : 'default'
                  }
                >
                  {title}
                </AppText>
              ) : (
                title
              )}

              {description ? (
                typeof description ===
                  'string' ||
                typeof description ===
                  'number' ? (
                  <AppText
                    variant="bodySmall"
                    tone={
                      disabled
                        ? 'disabled'
                        : 'secondary'
                    }
                  >
                    {description}
                  </AppText>
                ) : (
                  description
                )
              ) : null}
            </AppStack>

            <Animated.View
              style={chevronStyle}
            >
              <AppIcon
                icon={
                  ChevronDown
                }
                size="md"
                tone={
                  disabled
                    ? 'disabled'
                    : 'secondary'
                }
                decorative
              />
            </Animated.View>
          </AppInline>
        </AppPressable>

        {isExpanded ? (
          <Animated.View
            entering={
              contentEntering
            }
            exiting={
              contentExiting
            }
            layout={
              accordionLayout
            }
            style={[
              styles.content,
              contentStyle,
            ]}
          >
            {children}
          </Animated.View>
        ) : null}
      </AppSurface>
    </Animated.View>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    header: {
      minHeight:
        theme.sizes.control.md,
      justifyContent: 'center',
      paddingHorizontal:
        theme.spacing.lg,
      paddingVertical:
        theme.spacing.md,
    },

    content: {
      paddingHorizontal:
        theme.spacing.lg,
      paddingBottom:
        theme.spacing.lg,
    },
  }),
);
