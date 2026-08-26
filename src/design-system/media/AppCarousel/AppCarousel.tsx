import {
  useEffect,
  useRef,
} from 'react';
import {
  View,
} from 'react-native';
import {
  StyleSheet,
} from 'react-native-unistyles';

import {
  useControllableState,
} from '../../hooks';
import {
  AppInline,
} from '../../layout';

import {
  AppPager,
  type AppPagerHandle,
} from '../_internal/AppPager';

import type {
  AppCarouselProps,
} from './AppCarousel.types';

const clampIndex = (
  index: number,
  length: number,
): number => {
  if (length <= 0) {
    return 0;
  }

  return Math.min(
    length - 1,
    Math.max(
      0,
      Math.floor(index),
    ),
  );
};

export const AppCarousel = <
  TItem,
>({
  items,
  keyExtractor,
  renderItem,
  index,
  defaultIndex = 0,
  onIndexChange,
  aspectRatio = 16 / 9,
  height,
  scrollEnabled = true,
  showIndicators = true,
  accessibilityLabel,
  style,
  pageStyle,
  testID,
}: AppCarouselProps<TItem>) => {
  const pagerRef =
    useRef<AppPagerHandle>(
      null,
    );

  const controlled =
    index !== undefined;

  const initial =
    clampIndex(
      index ??
        defaultIndex,
      items.length,
    );

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useControllableState<number>(
      controlled
        ? {
            value:
              clampIndex(
                index ?? 0,
                items.length,
              ),
            defaultValue:
              initial,
            onValueChange:
              onIndexChange,
          }
        : {
            defaultValue:
              initial,
            onValueChange:
              onIndexChange,
          },
    );

  const safeIndex =
    clampIndex(
      currentIndex,
      items.length,
    );

  useEffect(() => {
    if (items.length <= 0) {
      return;
    }

    pagerRef.current
      ?.setPageWithoutAnimation(
        safeIndex,
      );
  }, [
    items.length,
    safeIndex,
  ]);

  return (
    <View
      accessible={
        Boolean(
          accessibilityLabel,
        )
      }
      accessibilityLabel={
        accessibilityLabel
      }
      accessibilityValue={
        items.length > 0
          ? {
              min: 1,
              max:
                items.length,
              now:
                safeIndex +
                1,
              text:
                `${safeIndex + 1} de ${items.length}`,
            }
          : undefined
      }
      style={[
        styles.root,
        style,
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.viewport,
          height
            ? {
                height,
              }
            : {
                aspectRatio,
              },
        ]}
      >
        <AppPager
          ref={pagerRef}
          initialPage={
            initial
          }
          scrollEnabled={
            scrollEnabled
          }
          onPageSelected={(
            next,
          ) => {
            setCurrentIndex(
              clampIndex(
                next,
                items.length,
              ),
            );
          }}
          style={styles.pager}
          pageStyle={
            pageStyle
          }
        >
          {items.map(
            (
              item,
              itemIndex,
            ) => (
              <View
                key={
                  keyExtractor(
                    item,
                    itemIndex,
                  )
                }
                style={
                  styles.page
                }
              >
                {renderItem(
                  item,
                  itemIndex,
                )}
              </View>
            ),
          )}
        </AppPager>
      </View>

      {showIndicators &&
      items.length > 1 ? (
        <View
          accessible
          accessibilityLabel={
            `${safeIndex + 1} de ${items.length}`
          }
          style={
            styles.indicatorWrap
          }
        >
          <AppInline
            gap="xs"
            align="center"
            justify="center"
          >
            {items.map(
              (
                item,
                itemIndex,
              ) => (
                <View
                  key={
                    `indicator-${keyExtractor(item, itemIndex)}`
                  }
                  accessible={false}
                  style={
                    styles.dot(
                      itemIndex ===
                        safeIndex,
                    )
                  }
                />
              ),
            )}
          </AppInline>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create(
  (theme) => ({
    root: {
      width: '100%',
    },

    viewport: {
      width: '100%',
      overflow: 'hidden',
      borderRadius:
        theme.radius.lg,
      backgroundColor:
        theme.colors
          .surfaceSecondary,
    },

    pager: {
      flex: 1,
      width: '100%',
      height: '100%',
    },

    page: {
      flex: 1,
      width: '100%',
      height: '100%',
    },

    indicatorWrap: {
      paddingTop:
        theme.spacing.sm,
    },

    dot: (
      active: boolean,
    ) => ({
      width:
        active ? 16 : 6,
      height: 6,
      borderRadius:
        theme.radius.full,
      backgroundColor:
        active
          ? theme.colors
              .primaryStrong
          : theme.colors
              .borderStrong,
    }),
  }),
);
