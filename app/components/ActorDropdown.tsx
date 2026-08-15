import Image from "next/image";
import type { ActorSuggestion } from "@/lib/types";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

interface ActorDropdownProps {
  suggestions: ActorSuggestion[];
  onSelect: (actor: ActorSuggestion) => void;
  activeIndex: number;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry: () => void;
}

export default function ActorDropdown({
  suggestions,
  onSelect,
  activeIndex,
  isLoading,
  isError,
  isEmpty,
  onRetry,
}: ActorDropdownProps) {
  if (suggestions.length === 0 && !isLoading && !isError && !isEmpty) {
    return null;
  }

  return (
    <div
      id="actor-suggestions"
      role="listbox"
      aria-label="Actor suggestions"
      aria-busy={isLoading}
      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden z-50"
    >
      {isLoading && suggestions.length === 0 && (
        <div className="p-2">
          <output className="sr-only">Loading actors…</output>
          {Array.from({ length: 4 }, (_, i) => `actor-loading-${i}`).map(
            (key) => (
              <div key={key} className="flex items-center gap-3 px-2 py-2.5">
                <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                  <div className="h-3 w-1/3 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {isError && suggestions.length === 0 && (
        <div className="px-4 py-5 text-center" role="alert">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            We couldn&apos;t load actor suggestions.
          </p>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {isEmpty && (
        <p className="px-4 py-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No actors found.
        </p>
      )}

      {suggestions.map((actor, i) => (
        <div
          key={actor.id}
          id={`actor-suggestion-${actor.id}`}
          role="option"
          aria-selected={i === activeIndex}
          tabIndex={0}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(actor);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(actor);
            }
          }}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
            i === activeIndex
              ? "bg-zinc-100 dark:bg-zinc-800"
              : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
          }`}
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 shrink-0">
            {actor.profile_path ? (
              <Image
                src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                alt={actor.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-zinc-400 text-xs">
                ?
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50 truncate">
              {actor.name}
            </p>
            {actor.known_for_department && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {actor.known_for_department}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
