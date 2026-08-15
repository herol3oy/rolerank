"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  actorQueryOptions,
  actorSearchQueryKey,
  actorSearchQueryOptions,
  normalizeActorQuery,
} from "@/lib/queries";
import {
  clearRecentActors,
  readRecentActors,
  saveRecentActor,
} from "@/lib/search-history";
import type { ActorSuggestion } from "@/lib/types";
import ActorDropdown from "./ActorDropdown";
import RecentActors from "./RecentActors";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentActors, setRecentActors] = useState<ActorSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const normalizedQuery = normalizeActorQuery(query);
  const hasValidQuery = normalizedQuery.length >= 2;

  useEffect(() => {
    if (!hasValidQuery) {
      setDebouncedQuery("");
      return;
    }

    const cached = queryClient.getQueryData<ActorSuggestion[]>(
      actorSearchQueryKey(normalizedQuery),
    );
    if (cached !== undefined) {
      setDebouncedQuery(normalizedQuery);
      return;
    }

    const timeout = setTimeout(() => setDebouncedQuery(normalizedQuery), 300);
    return () => clearTimeout(timeout);
  }, [hasValidQuery, normalizedQuery, queryClient]);

  const searchQuery = useQuery({
    ...actorSearchQueryOptions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const immediateCachedSuggestions = hasValidQuery
    ? queryClient.getQueryData<ActorSuggestion[]>(
        actorSearchQueryKey(normalizedQuery),
      )
    : undefined;
  const isCurrentQuery = normalizedQuery === debouncedQuery;
  const suggestions =
    immediateCachedSuggestions ??
    (isCurrentQuery ? (searchQuery.data ?? []) : []);
  const isWaitingForDebounce =
    hasValidQuery &&
    !isCurrentQuery &&
    immediateCachedSuggestions === undefined;
  const isLoading =
    isWaitingForDebounce ||
    (isCurrentQuery && (searchQuery.isPending || searchQuery.isFetching));
  const isError =
    isCurrentQuery && searchQuery.isError && suggestions.length === 0;
  const isEmpty =
    isCurrentQuery &&
    searchQuery.isSuccess &&
    !searchQuery.isFetching &&
    suggestions.length === 0;
  const isDropdownVisible =
    isOpen &&
    hasValidQuery &&
    (isLoading || isError || isEmpty || suggestions.length > 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);
    setIsOpen(value.trim().length >= 2);
  }

  function handleSelect(actor: ActorSuggestion) {
    setQuery(actor.name);
    setIsOpen(false);
    setRecentActors(saveRecentActor(actor));
    void queryClient.prefetchQuery(actorQueryOptions(actor.id));
    router.push(`/actor/${actor.id}?name=${encodeURIComponent(actor.name)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!isDropdownVisible || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    }
  }

  useEffect(() => {
    setRecentActors(readRecentActors());
    inputRef.current?.focus();

    return () => {
      if (blurRef.current) clearTimeout(blurRef.current);
    };
  }, []);

  return (
    <div className="relative w-full max-w-lg">
      <label htmlFor="actor-search" className="sr-only">
        Search for an actor
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          ref={inputRef}
          id="actor-search"
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isDropdownVisible}
          aria-controls={isDropdownVisible ? "actor-suggestions" : undefined}
          aria-activedescendant={
            activeIndex >= 0 && suggestions[activeIndex]
              ? `actor-suggestion-${suggestions[activeIndex]?.id}`
              : undefined
          }
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            blurRef.current = setTimeout(() => setIsOpen(false), 150);
          }}
          onFocus={() => hasValidQuery && setIsOpen(true)}
          placeholder="Search for an actor..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 text-base transition"
        />
        {isLoading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-4 w-4 text-zinc-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </span>
        )}
      </div>
      {isDropdownVisible && (
        <ActorDropdown
          suggestions={suggestions}
          onSelect={handleSelect}
          activeIndex={activeIndex}
          isLoading={isLoading}
          isError={isError}
          isEmpty={isEmpty}
          onRetry={() => searchQuery.refetch()}
        />
      )}
      <RecentActors
        actors={recentActors}
        onSelect={handleSelect}
        onClear={() => setRecentActors(clearRecentActors())}
      />
    </div>
  );
}
