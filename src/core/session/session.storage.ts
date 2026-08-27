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

export async function clearPersistedSession(): Promise<void> {
  await secureStorage.removeItem(SESSION_STORAGE_KEY);
}

async function persistSession(session: PersistedSession): Promise<void> {
  await secureStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}
