import type { Actor, MovieCredit } from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is not set");
  return key;
}

export async function searchActors(query: string): Promise<Actor[]> {
  const url = new URL(`${TMDB_BASE}/search/person`);
  url.searchParams.set("api_key", getKey());
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);

  const data = await res.json();
  return (data.results ?? []) as Actor[];
}

export async function getMovieCredits(actorId: number): Promise<MovieCredit[]> {
  const url = new URL(`${TMDB_BASE}/person/${actorId}/movie_credits`);
  url.searchParams.set("api_key", getKey());

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`TMDB movie_credits failed: ${res.status}`);

  const data = await res.json();
  return (data.cast ?? []) as MovieCredit[];
}

export async function getMovieExternalIds(
  tmdbMovieId: number,
): Promise<string | null> {
  const url = new URL(`${TMDB_BASE}/movie/${tmdbMovieId}/external_ids`);
  url.searchParams.set("api_key", getKey());

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const data = await res.json();
  return (data.imdb_id as string) || null;
}

export async function getActorDetails(
  actorId: number,
): Promise<{ name: string; profile_path: string | null }> {
  const url = new URL(`${TMDB_BASE}/person/${actorId}`);
  url.searchParams.set("api_key", getKey());

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`TMDB person details failed: ${res.status}`);

  const data = await res.json();
  return {
    name: data.name as string,
    profile_path: data.profile_path as string | null,
  };
}
