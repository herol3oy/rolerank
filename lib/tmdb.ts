import type { Actor, MovieCredit } from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";

function looksLikeAccessToken(value: string): boolean {
  return value.length > 64 || value.split(".").length === 3;
}

function getCredential(): { value: string; useBearer: boolean } {
  const accessToken = process.env.TMDB_ACCESS_TOKEN?.trim();
  if (accessToken) return { value: accessToken, useBearer: true };

  const apiKey = process.env.TMDB_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("TMDB_ACCESS_TOKEN or TMDB_API_KEY is not set");
  }

  return {
    value: apiKey,
    useBearer: looksLikeAccessToken(apiKey),
  };
}

function fetchTmdb(url: URL, revalidate: number): Promise<Response> {
  const credential = getCredential();
  const headers: HeadersInit = { Accept: "application/json" };

  if (credential.useBearer) {
    headers.Authorization = `Bearer ${credential.value}`;
  } else {
    url.searchParams.set("api_key", credential.value);
  }

  return fetch(url, {
    headers,
    next: { revalidate },
  });
}

export async function searchActors(query: string): Promise<Actor[]> {
  const url = new URL(`${TMDB_BASE}/search/person`);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");

  const res = await fetchTmdb(url, 3600);
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);

  const data = await res.json();
  return (data.results ?? []) as Actor[];
}

export async function getMovieCredits(actorId: number): Promise<MovieCredit[]> {
  const url = new URL(`${TMDB_BASE}/person/${actorId}/movie_credits`);

  const res = await fetchTmdb(url, 86400);
  if (!res.ok) throw new Error(`TMDB movie_credits failed: ${res.status}`);

  const data = await res.json();
  return (data.cast ?? []) as MovieCredit[];
}

export async function getMovieExternalIds(
  tmdbMovieId: number,
): Promise<string | null> {
  const url = new URL(`${TMDB_BASE}/movie/${tmdbMovieId}/external_ids`);

  const res = await fetchTmdb(url, 86400);
  if (!res.ok) return null;

  const data = await res.json();
  return (data.imdb_id as string) || null;
}

export async function getActorDetails(
  actorId: number,
): Promise<{ name: string; profile_path: string | null }> {
  const url = new URL(`${TMDB_BASE}/person/${actorId}`);

  const res = await fetchTmdb(url, 86400);
  if (!res.ok) throw new Error(`TMDB person details failed: ${res.status}`);

  const data = await res.json();
  return {
    name: data.name as string,
    profile_path: data.profile_path as string | null,
  };
}
