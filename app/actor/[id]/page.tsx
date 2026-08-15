import { notFound } from "next/navigation";
import ActorPageClient from "./ActorPageClient";

export default async function ActorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actorId = Number(id);

  if (!Number.isSafeInteger(actorId) || actorId <= 0) notFound();

  return <ActorPageClient actorId={actorId} />;
}
