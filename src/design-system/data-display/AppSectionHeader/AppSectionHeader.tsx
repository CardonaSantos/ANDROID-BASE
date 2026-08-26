import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  AppInline,
  AppStack,
} from '../../layout';
import {
  AppText,
} from '../../primitives';

import type {
  AppSectionHeaderProps,
} from './AppSectionHeader.types';

const titleVariant = {
  sm: 'titleSmall',
  md: 'titleMedium',
  lg: 'titleLarge',
} as const;

export const AppSectionHeader = ({
  title,
  description,
  leading,
  action,
  size = 'md',
  style,
  testID,
}: AppSectionHeaderProps) => (
  <AppInline
    gap="lg"
    align="flex-start"
    justify="space-between"
    style={[
      styles.header,
      style,
    ]}
    testID={testID}
  >
    <AppInline
      gap="md"
      align="flex-start"
      flex
      style={styles.main}
    >
      {leading ? (
        <View
          style={styles.leading}
        >
          {leading}
        </View>
      ) : null}

      <AppStack
        gap="xs"
        flex
      >
        {typeof title ===
          'string' ||
        typeof title ===
          'number' ? (
          <AppText
            variant={
              titleVariant[size]
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
                size === 'lg'
                  ? 'bodyMedium'
                  : 'bodySmall'
              }
              tone="secondary"
            >
              {description}
            </AppText>
          ) : (
            description
          )
        ) : null}
      </AppStack>
    </AppInline>

    {action ? (
      <View
        style={styles.action}
      >
        {action}
      </View>
    ) : null}
  </AppInline>
);

const styles = StyleSheet.create(
  (theme) => ({
    header: {
      width: '100%',
      minWidth: 0,
    },

    main: {
      minWidth: 0,
    },

    leading: {
      paddingTop:
        theme.spacing.xs,
    },

    action: {
      flexShrink: 0,
    },
  }),
);
