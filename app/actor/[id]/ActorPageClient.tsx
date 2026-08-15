"use client";

import { useIsRestoring, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import ActorPageSkeleton from "@/app/components/ActorPageSkeleton";
import MovieGrid from "@/app/components/MovieGrid";
import { actorQueryOptions } from "@/lib/queries";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

export default function ActorPageClient({ actorId }: { actorId: number }) {
  const isRestoring = useIsRestoring();
  const actorQuery = useQuery(actorQueryOptions(actorId));

  if (isRestoring || actorQuery.isPending) {
    return <ActorPageSkeleton />;
  }

  if (actorQuery.isError) {
    return (
      <main className="min-h-full bg-zinc-50 dark:bg-black px-4 py-10">
        <div className="max-w-lg mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            We couldn&apos;t load this actor
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {actorQuery.error.message}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => actorQuery.refetch()}
              className="rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Back to search
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { actor, movies } = actorQuery.data;

  return (
    <main className="min-h-full bg-zinc-50 dark:bg-black px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to search
        </Link>

        <div className="flex items-center gap-5 mb-10">
          {actor.profile_path ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-700">
              <Image
                src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                alt={actor.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0 flex items-center justify-center text-zinc-400 text-xl font-bold">
              {actor.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {actor.name}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
              {movies.length} rated movie{movies.length !== 1 ? "s" : ""} ·
              sorted by IMDB rating
            </p>
          </div>
        </div>

        <MovieGrid movies={movies} />
      </div>
    </main>
  );
}
