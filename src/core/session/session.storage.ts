import { secureStorage } from "@/core/storage";

import {
  SESSION_STORAGE_KEY,
  SESSION_STORAGE_VERSION,
} from "./session.constants";

import { persistedSessionSchema } from "./session.schema";

import type { PersistedSession } from "./session.schema";

export async function readPersistedSession(): Promise<PersistedSession | null> {
  const raw = await secureStorage.getItem(SESSION_STORAGE_KEY);

  if (raw === null) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    await clearPersistedSession();

    return null;
  }

  const result = persistedSessionSchema.safeParse(parsed);

  if (!result.success) {
    await clearPersistedSession();

    return null;
  }

  return result.data;
}

export async function persistRefreshToken(refreshToken: string): Promise<void> {
  await persistSession({
    version: SESSION_STORAGE_VERSION,

    strategy: "refresh-token",

    refreshToken,
  });
}

export async function persistAccessToken(accessToken: string): Promise<void> {
  await persistSession({
    version: SESSION_STORAGE_VERSION,

    strategy: "access-token",

    accessToken,
  });
}

export async function revokePersistedSession(): Promise<void> {
  /*
   * First replace any stored
   * credential with an explicit
   * anonymous tombstone.
   *
   * If the later physical delete
   * fails, an old credential cannot
   * be restored on the next launch.
   */
  try {
    await persistSession({
      version: SESSION_STORAGE_VERSION,

      strategy: "none",
    });
  } catch (writeError) {
    /*
     * If overwriting failed, attempt
     * physical deletion as a fallback.
     *
     * If deletion succeeds, the
     * persisted session is still
     * safely revoked.
     */
    try {
      await clearPersistedSession();

      return;
    } catch {
      /*
       * Neither operation could revoke
       * the persisted credential.
       *
       * Preserve the original write
       * error, which already comes
       * normalized from core/storage.
       */
      throw writeError;
    }
  }

  /*
   * At this point the old credential
   * is already gone and the tombstone
   * is persisted.
   *
   * Physical deletion is cleanup only,
   * so its failure must not turn a
   * successfully revoked session into
   * a failed logout.
   */
  try {
    await clearPersistedSession();
  } catch {
    // Tombstone remains safely stored.
  }
}

export async function clearPersistedSession(): Promise<void> {
  await secureStorage.removeItem(SESSION_STORAGE_KEY);
}

async function persistSession(session: PersistedSession): Promise<void> {
  await secureStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}
