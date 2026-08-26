import {
  Children,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import {
  ScrollView,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import type {
  AppPagerHandle,
  AppPagerProps,
} from './AppPager.types';

export const AppPager =
  forwardRef<
    AppPagerHandle,
    AppPagerProps
  >(
    (
      {
        children,
        initialPage = 0,
        scrollEnabled = true,
        onPageSelected,
        style,
        pageStyle,
        testID,
      },
      ref,
    ) => {
      const scrollRef =
        useRef<
          ComponentRef<
            typeof ScrollView
          >
        >(null);

      const [
        width,
        setWidth,
      ] = useState(0);

      const [
        currentPage,
        setCurrentPage,
      ] =
        useState(
          initialPage,
        );

      const scrollToPage = (
        index: number,
        animated: boolean,
      ) => {
        const safeIndex =
          Math.max(
            0,
            index,
          );

        if (width > 0) {
          scrollRef.current
            ?.scrollTo({
              x:
                safeIndex *
                width,
              y: 0,
              animated,
            });
        }

        setCurrentPage(
          safeIndex,
        );
      };

      useImperativeHandle(
        ref,
        () => ({
          setPage(index) {
            scrollToPage(
              index,
              true,
            );
          },

          setPageWithoutAnimation(
            index,
          ) {
            scrollToPage(
              index,
              false,
            );
          },
        }),
        [width],
      );

      const handleLayout = (
        event:
          LayoutChangeEvent,
      ) => {
        const nextWidth =
          event.nativeEvent
            .layout.width;

        setWidth(
          nextWidth,
        );

        if (
          nextWidth > 0 &&
          currentPage > 0
        ) {
          requestAnimationFrame(
            () => {
              scrollRef.current
                ?.scrollTo({
                  x:
                    currentPage *
                    nextWidth,
                  y: 0,
                  animated:
                    false,
                });
            },
          );
        }
      };

      const handleMomentumEnd = (
        event:
          NativeSyntheticEvent<
            NativeScrollEvent
          >,
      ) => {
        if (width <= 0) {
          return;
        }

        const next =
          Math.max(
            0,
            Math.round(
              event.nativeEvent
                .contentOffset.x /
                width,
            ),
          );

        if (
          next ===
          currentPage
        ) {
          return;
        }

        setCurrentPage(next);
        onPageSelected?.(
          next,
        );
      };

      return (
        <View
          onLayout={
            handleLayout
          }
          style={style}
          testID={testID}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            scrollEnabled={
              scrollEnabled
            }
            showsHorizontalScrollIndicator={
              false
            }
            onMomentumScrollEnd={
              handleMomentumEnd
            }
            contentOffset={{
              x:
                width *
                initialPage,
              y: 0,
            }}
          >
            {Children.map(
              children,
              (
                child,
                index,
              ) => (
                <View
                  key={index}
                  style={[
                    {
                      width,
                    },
                    pageStyle,
                  ]}
                >
                  {child}
                </View>
              ),
            )}
          </ScrollView>
        </View>
      );
    },
  );

AppPager.displayName =
  'AppPager';
