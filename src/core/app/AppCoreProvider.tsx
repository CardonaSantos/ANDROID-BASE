import { useEffect, type ReactNode } from "react";

import { AppQueryProvider } from "@/core/query";

import { appCoreRuntime } from "./app-core.runtime";

import { useAppCoreError, useAppCoreStatus } from "./app-core.hooks";

import type { AppCoreErrorFallbackProps } from "./app-core.types";

export interface AppCoreProviderProps {
  children: ReactNode;

  loadingFallback?: ReactNode;

  renderError?: (props: AppCoreErrorFallbackProps) => ReactNode;
}

export function AppCoreProvider({
  children,
  loadingFallback = null,
  renderError,
}: AppCoreProviderProps) {
  const status = useAppCoreStatus();

  const error = useAppCoreError();

  useEffect(() => {
    const release = appCoreRuntime.start();

    return release;
  }, []);

  if (status === "idle" || status === "booting") {
    return loadingFallback;
  }

  if (status === "error") {
    if (!error) {
      throw new Error(
        "Application core entered an error state without an error.",
      );
    }

    if (renderError) {
      return renderError({
        error,

        retry: appCoreRuntime.retry,
      });
    }

    /*
     * Never silently swallow a
     * fatal bootstrap failure.
     *
     * An application-level Error
     * Boundary may handle this.
     */
    throw error;
  }

  return <AppQueryProvider>{children}</AppQueryProvider>;
}
