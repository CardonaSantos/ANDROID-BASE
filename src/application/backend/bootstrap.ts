import { configureCurrentUserLoader } from "@/core/access";

import {
  configureBeforeLogoutHandler,
  loadAuthProfile,
  mapAuthUserToCurrentUser,
} from "@/features/auth";

import { prepareTrackingForLogout } from "@/features/tracking/application/tracking-logout.action";

/*
 * =========================================================
 * CURRENT USER
 * =========================================================
 */

configureCurrentUserLoader(async ({ signal }) => {
  const user = await loadAuthProfile(signal);

  return mapAuthUserToCurrentUser(user);
});

/*
 * =========================================================
 * SAFE LOGOUT
 * =========================================================
 *
 * Auth continúa siendo independiente
 * del feature Tracking.
 *
 * La aplicación es la encargada de
 * componer ambos comportamientos.
 */

configureBeforeLogoutHandler(prepareTrackingForLogout);
