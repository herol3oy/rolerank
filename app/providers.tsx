"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
  removeOldestQuery,
} from "@tanstack/react-query-persist-client";
import { useState } from "react";

const QUERY_CACHE_KEY = "rolerank:query-cache:v1";
const QUERY_CACHE_BUSTER = "rolerank-v1";
const PERSISTED_QUERY_ROOTS = new Set(["actor", "actor-search"]);

function getSessionStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Number.POSITIVE_INFINITY,
            gcTime: Number.POSITIVE_INFINITY,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [persister] = useState(() =>
    createAsyncStoragePersister({
      storage: getSessionStorage(),
      key: QUERY_CACHE_KEY,
      retry: removeOldestQuery,
    }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: Number.POSITIVE_INFINITY,
        buster: QUERY_CACHE_BUSTER,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            query.state.status === "success" &&
            PERSISTED_QUERY_ROOTS.has(String(query.queryKey[0])),
        },
      }}
      onError={() => persister.removeClient()}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
