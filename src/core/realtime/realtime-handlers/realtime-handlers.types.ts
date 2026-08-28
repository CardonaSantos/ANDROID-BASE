import type {
  AppQueryKey,
} from "@/core/query";

import type {
  RealtimeEvent,
} from "@/core/realtime";

export type RealtimeFeatureEventHandler = (
  event: RealtimeEvent,
) => void | Promise<void>;

export interface RealtimeFeatureHandlerDefinition {
  type: string;

  handle:
    RealtimeFeatureEventHandler;
}

export type RealtimeFeatureHandlerErrorListener = (
  error: unknown,
  event: RealtimeEvent,
) => void;

export interface CreateRealtimeFeatureBindingOptions {
  handlers:
    readonly RealtimeFeatureHandlerDefinition[];

  onError?:
    RealtimeFeatureHandlerErrorListener;
}

export interface RealtimeFeatureBinding {
  start(): () => void;
}

export interface CreateRealtimeFeatureRuntimeOptions {
  bindings:
    readonly RealtimeFeatureBinding[];
}

export interface RealtimeFeatureRuntime {
  start(): () => void;
}

export interface RealtimeQueryInvalidationTarget {
  queryKey:
    AppQueryKey;

  exact?:
    boolean;
}

export type RealtimeQueryInvalidationResolver = (
  event: RealtimeEvent,
) =>
  readonly RealtimeQueryInvalidationTarget[];
