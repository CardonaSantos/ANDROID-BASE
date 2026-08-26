import {
  useEffect,
} from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  accessibilityAnnouncer,
} from '../../accessibility';
import {
  AppActionGroup,
  AppButton,
} from '../../actions';
import type {
  ComponentTone,
  SemanticColorToken,
} from '../../contracts';
import {
  AppStack,
} from '../../layout';
import {
  AppIcon,
  AppText,
} from '../../primitives';

import type {
  AppStateAction,
} from '../state.types';
import type {
  AppStateViewProps,
  AppStateAlignment,
  AppStateDensity,
} from './AppStateView.types';

export const AppStateView = ({
  title,
  description,
  icon,
  illustration,
  tone = 'neutral',
  align = 'center',
  density = 'default',
  fill = false,
  primaryAction,
  secondaryAction,
  actions,
  announceOnMount = false,
  announcement,
  announcementPriority = 'polite',
  style,
  testID,
}: AppStateViewProps) => {
  const resolvedAnnouncement =
    announcement ??
    (typeof title === 'string' ||
    typeof title === 'number'
      ? String(title)
      : undefined);

  useEffect(() => {
    if (
      !announceOnMount ||
      !resolvedAnnouncement
    ) {
      return;
    }

    if (
      announcementPriority ===
      'assertive'
    ) {
      accessibilityAnnouncer
        .assertive(
          resolvedAnnouncement,
        );
    } else {
      accessibilityAnnouncer
        .polite(
          resolvedAnnouncement,
        );
    }
  }, [
    announceOnMount,
    announcementPriority,
    resolvedAnnouncement,
  ]);

  const iconColor =
    resolveStateIconColorToken(
      tone,
    );

  return (
    <View
      testID={testID}
      style={[
        styles.root(
          align,
          density,
          fill,
        ),
        style,
      ]}
    >
      <AppStack
        gap={
          density === 'compact'
            ? 'md'
            : 'lg'
        }
        align={
          align === 'center'
            ? 'center'
            : 'flex-start'
        }
        style={styles.content}
      >
        {illustration ? (
          <View
            style={
              styles.illustration
            }
          >
            {illustration}
          </View>
        ) : icon ? (
          <View
            style={
              styles.iconContainer(
                density,
                tone,
              )
            }
          >
            <AppIcon
              icon={icon}
              size={
                density ===
                  'compact'
                  ? 'lg'
                  : 'xl'
              }
              colorToken={
                iconColor
              }
              decorative
            />
          </View>
        ) : null}

        <AppStack
          gap="sm"
          align={
            align === 'center'
              ? 'center'
              : 'flex-start'
          }
          style={styles.text}
        >
          {typeof title ===
            'string' ||
          typeof title ===
            'number' ? (
            <AppText
              variant={
                density ===
                  'compact'
                  ? 'titleMedium'
                  : 'titleLarge'
              }
              weight="semibold"
              align={
                align === 'center'
                  ? 'center'
                  : 'left'
              }
              accessibilityRole="header"
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
                variant={
                  density ===
                    'compact'
                    ? 'bodySmall'
                    : 'bodyMedium'
                }
                tone="secondary"
                align={
                  align ===
                  'center'
                    ? 'center'
                    : 'left'
                }
              >
                {description}
              </AppText>
            ) : (
              description
            )
          ) : null}
        </AppStack>

        {actions ? (
          actions
        ) : primaryAction ||
          secondaryAction ? (
          <AppActionGroup
            orientation="auto"
            align={
              align === 'center'
                ? 'center'
                : 'start'
            }
            style={
              styles.actions(
                align,
              )
            }
          >
            {secondaryAction ? (
              <StateActionButton
                action={
                  secondaryAction
                }
                fallbackVariant="outlined"
                fallbackTone="neutral"
              />
            ) : null}

            {primaryAction ? (
              <StateActionButton
                action={
                  primaryAction
                }
                fallbackVariant="solid"
                fallbackTone={
                  tone === 'neutral'
                    ? 'primary'
                    : tone
                }
              />
            ) : null}
          </AppActionGroup>
        ) : null}
      </AppStack>
    </View>
  );
};

interface StateActionButtonProps {
  action: AppStateAction;
  fallbackVariant:
    | 'solid'
    | 'soft'
    | 'outlined'
    | 'ghost';
  fallbackTone: ComponentTone;
}

const StateActionButton = ({
  action,
  fallbackVariant,
  fallbackTone,
}: StateActionButtonProps) => (
  <AppButton
    variant={
      action.variant ??
      fallbackVariant
    }
    tone={
      action.tone ??
      fallbackTone
    }
    leadingIcon={
      action.icon
    }
    disabled={
      action.disabled
    }
    loading={
      action.loading
    }
    accessibilityLabel={
      action
        .accessibilityLabel ??
      action.label
    }
    onPress={() => {
      action.onPress();
    }}
  >
    {action.label}
  </AppButton>
);

const resolveStateIconColorToken = (
  tone: ComponentTone,
): SemanticColorToken => {
  switch (tone) {
    case 'primary':
      return 'onPrimaryContainer';

    case 'success':
      return 'onSuccessContainer';

    case 'warning':
      return 'onWarningContainer';

    case 'danger':
      return 'onDangerContainer';

    case 'info':
      return 'onInfoContainer';

    case 'neutral':
    default:
      return 'text';
  }
};

const resolveStateContainerColorToken = (
  tone: ComponentTone,
):
  | 'surfaceSecondary'
  | 'primaryContainer'
  | 'successContainer'
  | 'warningContainer'
  | 'dangerContainer'
  | 'infoContainer' => {
  switch (tone) {
    case 'primary':
      return 'primaryContainer';

    case 'success':
      return 'successContainer';

    case 'warning':
      return 'warningContainer';

    case 'danger':
      return 'dangerContainer';

    case 'info':
      return 'infoContainer';

    case 'neutral':
    default:
      return 'surfaceSecondary';
  }
};

const styles = StyleSheet.create(
  (theme) => ({
    root: (
      align:
        AppStateAlignment,
      density:
        AppStateDensity,
      fill: boolean,
    ) => ({
      width: '100%',
      flex:
        fill ? 1 : undefined,
      alignItems:
        align === 'center'
          ? 'center'
          : 'stretch',
      justifyContent:
        fill
          ? 'center'
          : 'flex-start',
      paddingVertical:
        density === 'compact'
          ? theme.spacing.lg
          : theme.spacing['3xl'],
      paddingHorizontal:
        density === 'compact'
          ? theme.spacing.lg
          : theme.spacing['2xl'],
    }),

    content: {
      width: '100%',
      maxWidth:
        theme.sizes.content
          .compactMaxWidth,
    },

    illustration: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    iconContainer: (
      density:
        AppStateDensity,
      tone: ComponentTone,
    ) => ({
      width:
        density === 'compact'
          ? 48
          : 64,
      height:
        density === 'compact'
          ? 48
          : 64,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:
        theme.radius.full,
      backgroundColor:
        theme.colors[
          resolveStateContainerColorToken(
            tone,
          )
        ],
    }),

    text: {
      width: '100%',
      maxWidth:
        theme.sizes.content
          .readableMaxWidth,
    },

    actions: (
      align:
        AppStateAlignment,
    ) => ({
      alignSelf:
        align === 'center'
          ? 'center'
          : 'stretch',
    }),
  }),
);
