import { sessionStore } from "./_internal/session.store";

import type { AccessTokenProvider } from "./session.types";

export const sessionTokenProvider: AccessTokenProvider = Object.freeze({
  getAccessToken() {
    return sessionStore.getState().accessToken;
  },

  //   REVISAR A FUTURO
  subscribe(listener: any) {
    return sessionStore.subscribe((state, previousState) => {
      if (state.accessToken === previousState.accessToken) {
        return;
      }

      listener(state.accessToken);
    });
  },
});
