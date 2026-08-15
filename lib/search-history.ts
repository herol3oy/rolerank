import type { ActorSuggestion } from "./types";

const HISTORY_KEY = "rolerank:recent-actors:v1";
const HISTORY_LIMIT = 6;

function isActorSuggestion(value: unknown): value is ActorSuggestion {
  if (!value || typeof value !== "object") return false;

  const actor = value as Partial<ActorSuggestion>;
  return (
    typeof actor.id === "number" &&
    Number.isSafeInteger(actor.id) &&
    actor.id > 0 &&
    typeof actor.name === "string" &&
    (typeof actor.profile_path === "string" || actor.profile_path === null) &&
    typeof actor.known_for_department === "string"
  );
}

export function readRecentActors(): ActorSuggestion[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isActorSuggestion).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function saveRecentActor(actor: ActorSuggestion): ActorSuggestion[] {
  const next = [
    actor,
    ...readRecentActors().filter((recent) => recent.id !== actor.id),
  ].slice(0, HISTORY_LIMIT);

  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // History is an enhancement; navigation should still work without storage.
  }

  return next;
}

export function clearRecentActors(): ActorSuggestion[] {
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Keep the UI usable when browser storage is unavailable.
  }

  return [];
}
