import {
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  pressInteractionPresets,
  type InteractionIntensity,
} from '../interaction';
import {
  springPresets,
  timingPresets,
} from '../motion';
import { interaction } from '../tokens';

/**
 * Reanimated physical feedback used by AppPressable.
 *
 * Only transform/opacity are animated, keeping the interaction path suitable
 * for the UI thread and avoiding layout animation for ordinary presses.
 */
export const usePressFeedback = (
  intensity: InteractionIntensity,
  disabled: boolean,
) => {
  const preset =
    pressInteractionPresets[intensity];

  const pressed = useRef(false);
  const hovered = useRef(false);

  const scale = useSharedValue(1);
  const layerOpacity =
    useSharedValue(0);

  const animateScale = useCallback(
    (nextScale: number) => {
      scale.set(
        withSpring(
          nextScale,
          springPresets[
            preset.spring
          ],
        ),
      );
    },
    [preset.spring, scale],
  );

  const animateLayer = useCallback(
    (nextOpacity: number) => {
      layerOpacity.set(
        withTiming(
          nextOpacity,
          timingPresets.fast,
        ),
      );
    },
    [layerOpacity],
  );

  const pressIn = useCallback(() => {
    if (disabled) {
      return;
    }

    pressed.current = true;

    animateScale(preset.scale);
    animateLayer(
      preset.stateLayerOpacity,
    );
  }, [
    animateLayer,
    animateScale,
    disabled,
    preset.scale,
    preset.stateLayerOpacity,
  ]);

  const pressOut = useCallback(() => {
    pressed.current = false;

    animateScale(1);

    animateLayer(
      hovered.current
        ? interaction.stateLayer.hover
        : 0,
    );
  }, [animateLayer, animateScale]);

  const hoverIn = useCallback(() => {
    if (disabled) {
      return;
    }

    hovered.current = true;

    if (!pressed.current) {
      animateLayer(
        interaction.stateLayer.hover,
      );
    }
  }, [animateLayer, disabled]);

  const hoverOut = useCallback(() => {
    hovered.current = false;

    if (!pressed.current) {
      animateLayer(0);
    }
  }, [animateLayer]);

  useEffect(() => {
    if (!disabled) {
      return;
    }

    pressed.current = false;
    hovered.current = false;

    animateScale(1);
    animateLayer(0);
  }, [
    animateLayer,
    animateScale,
    disabled,
  ]);

  const animatedStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale: scale.get(),
        },
      ],
    }));

  const stateLayerAnimatedStyle =
    useAnimatedStyle(() => ({
      opacity:
        layerOpacity.get(),
    }));

  return {
    animatedStyle,
    stateLayerAnimatedStyle,
    pressIn,
    pressOut,
    hoverIn,
    hoverOut,
  } as const;
};
