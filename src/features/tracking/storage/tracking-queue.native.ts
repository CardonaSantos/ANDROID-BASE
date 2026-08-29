import * as SQLite from "expo-sqlite";

import {
  registerTrackingLocationInputSchema,
  type RegisterTrackingLocationInput,
} from "../api/tracking.contracts";

import type { QueuedTrackingLocation } from "./tracking-queue.types";

const DATABASE_NAME = "nova-tracking.db";

interface TrackingQueueRow {
  id: number;

  payload_json: string;

  attempts: number;

  created_at: string;
}

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function createDedupeKey(payload: RegisterTrackingLocationInput): string {
  return [
    payload.sesionTrackingId,
    payload.capturadoEn,
    payload.latitud,
    payload.longitud,
  ].join("|");
}

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(
    async (database) => {
      await database.execAsync(`
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS tracking_location_queue (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              session_id INTEGER NOT NULL,
              dedupe_key TEXT NOT NULL UNIQUE,
              payload_json TEXT NOT NULL,
              attempts INTEGER NOT NULL DEFAULT 0,
              created_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_tracking_location_queue_session
            ON tracking_location_queue(session_id, id);
          `);

      return database;
    },
  );

  return databasePromise;
}

export async function enqueueTrackingLocation(
  payload: RegisterTrackingLocationInput,
): Promise<void> {
  const parsed = registerTrackingLocationInputSchema.parse(payload);

  const database = await getDatabase();

  await database.runAsync(
    `
      INSERT OR IGNORE INTO tracking_location_queue (
        session_id,
        dedupe_key,
        payload_json,
        attempts,
        created_at
      )
      VALUES (?, ?, ?, 0, ?)
    `,
    parsed.sesionTrackingId,
    createDedupeKey(parsed),
    JSON.stringify(parsed),
    new Date().toISOString(),
  );
}

export async function listQueuedTrackingLocationsForSession(
  sessionId: number,
  limit = 25,
): Promise<QueuedTrackingLocation[]> {
  const database = await getDatabase();

  const safeLimit = Math.max(1, Math.min(limit, 100));

  const rows = await database.getAllAsync<TrackingQueueRow>(
    `
        SELECT
          id,
          payload_json,
          attempts,
          created_at
        FROM tracking_location_queue
        WHERE session_id = ?
        ORDER BY id ASC
        LIMIT ?
      `,
    sessionId,
    safeLimit,
  );

  const result: QueuedTrackingLocation[] = [];

  for (const row of rows) {
    try {
      const json = JSON.parse(row.payload_json);

      const parsed = registerTrackingLocationInputSchema.safeParse(json);

      /*
       * Una fila local corrupta no puede
       * bloquear permanentemente toda
       * la cola.
       */
      if (!parsed.success) {
        await database.runAsync(
          `
            DELETE FROM tracking_location_queue
            WHERE id = ?
          `,
          row.id,
        );

        continue;
      }

      result.push({
        id: row.id,

        payload: parsed.data,

        attempts: row.attempts,

        createdAt: row.created_at,
      });
    } catch {
      await database.runAsync(
        `
          DELETE FROM tracking_location_queue
          WHERE id = ?
        `,
        row.id,
      );
    }
  }

  return result;
}

export async function markQueuedTrackingLocationAttempt(
  id: number,
): Promise<void> {
  const database = await getDatabase();

  await database.runAsync(
    `
      UPDATE tracking_location_queue
      SET attempts = attempts + 1
      WHERE id = ?
    `,
    id,
  );
}

export async function deleteQueuedTrackingLocation(id: number): Promise<void> {
  const database = await getDatabase();

  await database.runAsync(
    `
      DELETE FROM tracking_location_queue
      WHERE id = ?
    `,
    id,
  );
}

export async function countQueuedTrackingLocationsForSession(
  sessionId: number,
): Promise<number> {
  const database = await getDatabase();

  const row = await database.getFirstAsync<{
    total: number;
  }>(
    `
        SELECT COUNT(*) AS total
        FROM tracking_location_queue
        WHERE session_id = ?
      `,
    sessionId,
  );

  return row?.total ?? 0;
}

export async function clearQueuedTrackingLocationsForSession(
  sessionId: number,
): Promise<void> {
  const database = await getDatabase();

  await database.runAsync(
    `
      DELETE FROM tracking_location_queue
      WHERE session_id = ?
    `,
    sessionId,
  );
}
