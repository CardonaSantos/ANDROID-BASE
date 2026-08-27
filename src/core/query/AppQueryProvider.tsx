import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./query-client";

export interface AppQueryProviderProps {
  children: ReactNode;

  client?: QueryClient;
}

export function AppQueryProvider({
  children,
  client = queryClient,
}: AppQueryProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
