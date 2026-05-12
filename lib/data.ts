import { getMovieRating } from "./omdb";
import { getMovieCredits, getMovieExternalIds } from "./tmdb";
import type { Movie } from "./types";

// Run async tasks in batches to avoid overwhelming the connection pool
async function batchAll<T>(
  items: (() => Promise<T>)[],
  batchSize: number,
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize).map((fn) => fn());
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }
  return results;
}

// Fetch external IDs and OMDB rating for a single movie credit
async function enrichMovie(credit: {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  character: string;
}): Promise<Movie | null> {
  const imdbId = await getMovieExternalIds(credit.id);
  if (!imdbId) return null;

  const rating = await getMovieRating(imdbId);
  if (!rating) return null;

  return {
    tmdbId: credit.id,
    imdbId,
    title: credit.title,
    poster_path: credit.poster_path,
    year: credit.release_date ? credit.release_date.slice(0, 4) : "N/A",
    character: credit.character,
    imdbRating: rating.imdbRating,
    imdbVotes: rating.imdbVotes,
  };
}

export async function getActorMoviesWithRatings(
  actorId: number,
): Promise<Movie[]> {
  const credits = await getMovieCredits(actorId);

  // Deduplicate by movie id (actor may appear in multiple roles)
  const unique = Array.from(new Map(credits.map((c) => [c.id, c])).values());

  // Fetch external IDs + OMDB ratings in batches of 10 to avoid ETIMEDOUT
  const results = await batchAll(
    unique.map((c) => () => enrichMovie(c)),
    10,
  );

  const movies = results.filter((m): m is Movie => m !== null);

  // Sort by IMDB rating descending
  return movies.sort((a, b) => b.imdbRating - a.imdbRating);
}
