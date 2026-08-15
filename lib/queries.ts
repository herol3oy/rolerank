import { queryOptions } from "@tanstack/react-query";
import type { ActorPageData, ActorSuggestion } from "./types";

export function normalizeActorQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function actorSearchQueryKey(query: string) {
  return ["actor-search", normalizeActorQuery(query)] as const;
}

export function actorQueryKey(actorId: number) {
  return ["actor", actorId] as const;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export function actorSearchQueryOptions(query: string) {
  const normalizedQuery = normalizeActorQuery(query);

  return queryOptions({
    queryKey: actorSearchQueryKey(normalizedQuery),
    queryFn: ({ signal }) =>
      getJson<ActorSuggestion[]>(
        `/api/search?q=${encodeURIComponent(normalizedQuery)}`,
        signal,
      ),
  });
}

export function actorQueryOptions(actorId: number) {
  return queryOptions({
    queryKey: actorQueryKey(actorId),
    queryFn: ({ signal }) =>
      getJson<ActorPageData>(`/api/actors/${actorId}`, signal),
  });
}
