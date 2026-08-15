import Image from "next/image";
import type { ActorSuggestion } from "@/lib/types";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

interface RecentActorsProps {
  actors: ActorSuggestion[];
  onSelect: (actor: ActorSuggestion) => void;
  onClear: () => void;
}

export default function RecentActors({
  actors,
  onSelect,
  onClear,
}: RecentActorsProps) {
  if (actors.length === 0) return null;

  return (
    <section className="mt-6" aria-labelledby="recent-actors-heading">
      <div className="mb-2.5 flex items-center justify-between">
        <h2
          id="recent-actors-heading"
          className="text-sm font-semibold text-zinc-700 dark:text-zinc-200"
        >
          Recent searches
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actors.map((actor) => (
          <button
            key={actor.id}
            type="button"
            onClick={() => onSelect(actor)}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-left shadow-sm transition-colors hover:border-yellow-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-yellow-400"
          >
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              {actor.profile_path ? (
                <Image
                  src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-zinc-500 dark:text-zinc-300">
                  {actor.name.charAt(0)}
                </span>
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {actor.name}
              </span>
              {actor.known_for_department && (
                <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {actor.known_for_department}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
