import type { AppError } from "@/core/errors";

export type AppCoreStatus = "idle" | "booting" | "ready" | "error";

export interface AppCoreSnapshot {
  status: AppCoreStatus;

  error: AppError | null;
}

export interface AppCoreErrorFallbackProps {
  error: AppError;

  retry: () => void;
}
