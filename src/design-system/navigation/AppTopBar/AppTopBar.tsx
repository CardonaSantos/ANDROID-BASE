import {
  View,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  AppBackButton,
} from '../../actions';
import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  AppDivider,
  AppText,
} from '../../primitives';

import type {
  AppTopBarProps,
  AppTopBarVariant,
} from './AppTopBar.types';

const DEFAULT_EDGES = [
  'top',
  'left',
  'right',
] as const;

export const AppTopBar = ({
  title,
  subtitle,
  leading,
  actions,
  back = false,
  onBack,
  fallbackHref,
  variant = 'surface',
  titleAlignment = 'start',
  safeAreaEdges = [
    ...DEFAULT_EDGES,
  ],
  divider = false,
  style,
  testID,
}: AppTopBarProps) => {
  const leadingContent =
    leading ??
    (back ? (
      <AppBackButton
        onBack={onBack}
        fallbackHref={
          fallbackHref
        }
      />
    ) : null);

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[
        styles.safeArea(
          variant,
        ),
        style,
      ]}
      testID={testID}
    >
      <View
        style={
          styles.toolbar
        }
      >
        <View
          style={
            styles.leading
          }
        >
          {leadingContent}
        </View>

        <View
          style={
            titleAlignment ===
            'center'
              ? styles.centerTitle
              : styles.startTitle
          }
        >
          <AppStack
            gap="xxs"
            align={
              titleAlignment ===
                'center'
                ? 'center'
                : 'flex-start'
            }
          >
            {typeof title ===
              'string' ||
            typeof title ===
              'number' ? (
              <AppText
                variant="titleMedium"
                weight="semibold"
                numberOfLines={1}
                accessibilityRole="header"
                align={
                  titleAlignment ===
                    'center'
                    ? 'center'
                    : 'left'
                }
              >
                {title}
              </AppText>
            ) : (
              title
            )}

            {subtitle ? (
              typeof subtitle ===
                'string' ||
              typeof subtitle ===
                'number' ? (
                <AppText
                  variant="caption"
                  tone="secondary"
                  numberOfLines={1}
                  align={
                    titleAlignment ===
                      'center'
                      ? 'center'
                      : 'left'
                  }
                >
                  {subtitle}
                </AppText>
              ) : (
                subtitle
              )
            ) : null}
          </AppStack>
        </View>

        <AppInline
          gap="xs"
          align="center"
          justify="flex-end"
          style={
            styles.actions
          }
        >
          {actions}
        </AppInline>
      </View>

      {divider ? (
        <AppDivider />
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    safeArea: (
      variant:
        AppTopBarVariant,
    ) => ({
      width: '100%',
      backgroundColor:
        variant ===
          'transparent'
          ? 'transparent'
          : variant ===
              'background'
            ? theme.colors
                .background
            : theme.colors
                .surface,
      zIndex:
        theme.zIndex.sticky,
    }),

    toolbar: {
      minHeight:
        theme.sizes.control.xl,
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal:
        theme.spacing.sm,
    },

    leading: {
      minWidth: 48,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },

    startTitle: {
      minWidth: 0,
      flex: 1,
      paddingHorizontal:
        theme.spacing.sm,
    },

    centerTitle: {
      pointerEvents: 'none',
      position: 'absolute',
      left: 72,
      right: 72,
      alignItems: 'center',
      justifyContent: 'center',
    },

    actions: {
      minWidth: 48,
      flexShrink: 0,
    },
  }),
);
