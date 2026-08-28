import {
  createRealtimeFeatureRuntime,
} from "@/core/realtime/realtime-handlers";

import {
  appRealtimeFeatureBindings,
} from "./app-realtime-feature.bindings";

export const appRealtimeFeatureRuntime =
  createRealtimeFeatureRuntime({
    bindings:
      appRealtimeFeatureBindings,
  });
