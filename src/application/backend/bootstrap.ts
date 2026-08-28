import { configureCurrentUserLoader } from "@/core/access";

import { loadAuthProfile, mapAuthUserToCurrentUser } from "@/features/auth";

configureCurrentUserLoader(async ({ signal }) => {
  const user = await loadAuthProfile(signal);

  return mapAuthUserToCurrentUser(user);
});
