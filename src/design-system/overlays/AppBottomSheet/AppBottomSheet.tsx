import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {
  useUnistyles,
} from 'react-native-unistyles';

import {
  useControllableState,
} from '../../hooks';

import type {
  AppBottomSheetProps,
} from './AppBottomSheet.types';

export const AppBottomSheet = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  snapPoints,
  initialIndex = 0,
  enableDynamicSizing,
  maxDynamicContentSize,
  enablePanDownToClose = true,
  dismissOnBackdropPress = true,
  onIndexChange,
  contentStyle,
  testID,
}: AppBottomSheetProps) => {
  const { theme } =
    useUnistyles();

  const modalRef =
    useRef<BottomSheetModal>(
      null,
    );

  /**
   * 5.2.x has had lifecycle regressions around dismissing a modal that was
   * never presented. Track presentation explicitly and never issue dismiss()
   * before the first successful present().
   */
  const presentedRef =
    useRef(false);

  const controlled =
    open !== undefined;

  const [
    isOpen,
    setOpen,
  ] =
    useControllableState<boolean>(
      controlled
        ? {
            value:
              open ?? false,
            defaultValue:
              defaultOpen,
            onValueChange:
              onOpenChange,
          }
        : {
            defaultValue:
              defaultOpen,
            onValueChange:
              onOpenChange,
          },
    );

  const stableSnapPoints =
    useMemo(
      () =>
        snapPoints
          ? [...snapPoints]
          : undefined,
      [snapPoints],
    );

  useEffect(() => {
    if (isOpen) {
      presentedRef.current =
        true;

      modalRef.current
        ?.present();

      return;
    }

    if (
      presentedRef.current
    ) {
      modalRef.current
        ?.dismiss();
    }
  }, [isOpen]);

  const renderBackdrop =
    useCallback(
      (
        props:
          BottomSheetBackdropProps,
      ) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={
            -1
          }
          opacity={0.5}
          pressBehavior={
            dismissOnBackdropPress
              ? 'close'
              : 'none'
          }
        />
      ),
      [
        dismissOnBackdropPress,
      ],
    );

  return (
    <BottomSheetModal
      ref={modalRef}
      index={initialIndex}
      snapPoints={
        stableSnapPoints
      }
      enableDynamicSizing={
        enableDynamicSizing ??
        !stableSnapPoints
      }
      maxDynamicContentSize={
        maxDynamicContentSize
      }
      enablePanDownToClose={
        enablePanDownToClose
      }
      backdropComponent={
        renderBackdrop
      }
      backgroundStyle={{
        backgroundColor:
          theme.colors
            .surfaceElevated,
      }}
      handleIndicatorStyle={{
        backgroundColor:
          theme.colors
            .borderStrong,
      }}
      onChange={
        onIndexChange
      }
      onDismiss={() => {
        presentedRef.current =
          false;
        setOpen(false);
      }}
    >
      <BottomSheetView
        testID={testID}
        style={[
          {
            paddingHorizontal:
              theme.spacing.lg,
            paddingBottom:
              theme.spacing.xl,
          },
          contentStyle,
        ]}
      >
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
