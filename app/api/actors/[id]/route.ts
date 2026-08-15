import { getActorMoviesWithRatings } from "@/lib/data";
import { getActorDetails } from "@/lib/tmdb";
import type { ActorPageData } from "@/lib/types";

const PRIVATE_NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const actorId = Number(id);

  if (!Number.isSafeInteger(actorId) || actorId <= 0) {
    return Response.json(
      { error: "Invalid actor ID" },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS },
    );
  }

  try {
    const [actor, movies] = await Promise.all([
      getActorDetails(actorId),
      getActorMoviesWithRatings(actorId),
    ]);
    const result: ActorPageData = {
      actor: { id: actorId, ...actor },
      movies,
    };

    return Response.json(result, { headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error) {
    console.error(`Failed to load actor ${actorId}`, error);
    return Response.json(
      { error: "Unable to load this actor right now" },
      { status: 500, headers: PRIVATE_NO_STORE_HEADERS },
    );
  }
}
