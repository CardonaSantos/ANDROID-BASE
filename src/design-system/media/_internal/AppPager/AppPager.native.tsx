import {
  Children,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  View,
} from 'react-native';
import PagerView, {
  type PagerViewRef,
} from '@expo/ui/community/pager-view';

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
      const pagerRef =
        useRef<PagerViewRef>(
          null,
        );

      useImperativeHandle(
        ref,
        () => ({
          setPage(index) {
            pagerRef.current
              ?.setPage(
                index,
              );
          },

          setPageWithoutAnimation(
            index,
          ) {
            pagerRef.current
              ?.setPageWithoutAnimation(
                index,
              );
          },
        }),
        [],
      );

      return (
        <PagerView
          ref={pagerRef}
          initialPage={
            initialPage
          }
          scrollEnabled={
            scrollEnabled
          }
          onPageSelected={(
            event,
          ) => {
            onPageSelected?.(
              event.nativeEvent
                .position,
            );
          }}
          style={style}
          testID={testID}
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
                    flex: 1,
                  },
                  pageStyle,
                ]}
              >
                {child}
              </View>
            ),
          )}
        </PagerView>
      );
    },
  );

AppPager.displayName =
  'AppPager';
