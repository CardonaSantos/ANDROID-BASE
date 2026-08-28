import {
  queryClient,
} from "@/core/query";

import type {
  RealtimeFeatureEventHandler,
  RealtimeQueryInvalidationResolver,
} from "./realtime-handlers.types";

export function createRealtimeQueryInvalidationHandler(
  resolveTargets:
    RealtimeQueryInvalidationResolver,
): RealtimeFeatureEventHandler {
  return async (event) => {
    const targets =
      resolveTargets(
        event,
      );

    if (
      targets.length === 0
    ) {
      return;
    }

    await Promise.all(
      targets.map(
        ({
          queryKey,
          exact = false,
        }) =>
          queryClient.invalidateQueries(
            {
              queryKey,

              exact,
            },
          ),
      ),
    );
  };
}
