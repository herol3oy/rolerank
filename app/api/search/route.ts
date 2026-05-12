import type { NextRequest } from "next/server";
import { searchActors } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return Response.json([]);
  }

  try {
    const actors = await searchActors(q);
    // Return only the fields the client needs
    const results = actors.slice(0, 8).map((a) => ({
      id: a.id,
      name: a.name,
      profile_path: a.profile_path,
      known_for_department: a.known_for_department,
    }));
    return Response.json(results);
  } catch {
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
