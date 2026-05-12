import Image from "next/image";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

interface ActorSuggestion {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

interface ActorDropdownProps {
  suggestions: ActorSuggestion[];
  onSelect: (actor: ActorSuggestion) => void;
  activeIndex: number;
}

export default function ActorDropdown({
  suggestions,
  onSelect,
  activeIndex,
}: ActorDropdownProps) {
  if (suggestions.length === 0) return null;

  return (
    <div
      id="actor-suggestions"
      role="listbox"
      aria-label="Actor suggestions"
      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden z-50"
    >
      {suggestions.map((actor, i) => (
        <div
          key={actor.id}
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
