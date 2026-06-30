const USER_KEY = "el-reino-local-user-id";

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** ID local del dispositivo (respaldo sin Supabase y vinculación al primer login). */
export function getLocalUserId(): string {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(USER_KEY);
  if (existing) return existing;
  const id = createId();
  localStorage.setItem(USER_KEY, id);
  return id;
}

export function isHymnOwner(creatorId?: string): boolean {
  if (!creatorId) return false;
  return creatorId === getLocalUserId();
}
