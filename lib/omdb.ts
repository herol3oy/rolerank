interface OmdbRating {
  imdbRating: number;
  imdbVotes: string;
}

const OMDB_BASE = "https://www.omdbapi.com";

function getKey(): string {
  const key = process.env.OMDB_API_KEY;
  if (!key) throw new Error("OMDB_API_KEY is not set");
  return key;
}

export async function getMovieRating(
  imdbId: string,
): Promise<OmdbRating | null> {
  const url = new URL(OMDB_BASE);
  url.searchParams.set("apikey", getKey());
  url.searchParams.set("i", imdbId);
  url.searchParams.set("r", "json");

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const data = await res.json();
  if (data.Response === "False") return null;

  const rating = Number.parseFloat(data.imdbRating);
  if (Number.isNaN(rating)) return null;

  return { imdbRating: rating, imdbVotes: data.imdbVotes ?? "N/A" };
}
