import Image from "next/image";
import type { Movie } from "@/lib/types";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300";
const POSTER_PLACEHOLDER = "/poster-placeholder.svg";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterSrc = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : POSTER_PLACEHOLDER;

  return (
    <a
      href={`https://www.imdb.com/title/${movie.imdbId}/`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${movie.title} on IMDB`}
      className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-zinc-100 dark:border-zinc-800 hover:border-yellow-400 dark:hover:border-yellow-400"
    >
      <div className="relative w-full aspect-[2/3] bg-zinc-100 dark:bg-zinc-800">
        {movie.poster_path ? (
          <Image
            src={posterSrc}
            alt={`${movie.title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">
            No poster
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/75 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
          <span>★</span>
          <span>{movie.imdbRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <h2 className="font-semibold text-sm leading-snug text-zinc-900 dark:text-zinc-50 line-clamp-2">
          {movie.title}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{movie.year}</p>
        {movie.character && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 italic mt-auto pt-1 line-clamp-1">
            as {movie.character}
          </p>
        )}
      </div>
    </a>
  );
}
