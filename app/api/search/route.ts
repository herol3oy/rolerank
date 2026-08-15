import type { NextRequest } from "next/server";
import { searchActors } from "@/lib/tmdb";
import type { ActorSuggestion } from "@/lib/types";

const PRIVATE_NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return Response.json([], { headers: PRIVATE_NO_STORE_HEADERS });
  }

  try {
    const actors = await searchActors(q);
    // Return only the fields the client needs
    const results: ActorSuggestion[] = actors.slice(0, 8).map((a) => ({
      id: a.id,
      name: a.name,
      profile_path: a.profile_path,
      known_for_department: a.known_for_department,
    }));
    return Response.json(results, { headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error) {
    console.error(`Actor search failed for "${q}"`, error);
    return Response.json(
      { error: "Search failed" },
      { status: 500, headers: PRIVATE_NO_STORE_HEADERS },
    );
  }
}
