import { getLocalUserId } from "@/lib/localUser";
import type { CreateHymnInput, Hymn, UpdateHymnInput } from "../types";

const STORAGE_KEY = "el-reino-hymns";

const SEED_HYMNS: Hymn[] = [
  {
    id: "seed-1",
    title: "Santo, Santo, Santo",
    originalKey: "C",
    author: "Reginald Heber",
    lyrics: `[C]Santo, [G]santo, [C]santo
[C]Dios [F]poderoso [C]y [G]magnífico
[C]Santo, [G]santo, [C]santo
[F]Dios [C]de [G]poder [C]y [G]gloria`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `hymn-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function sanitizeHymn(raw: Record<string, unknown>): Hymn | null {
  const id = raw.id;
  const title = raw.title;
  const lyrics = raw.lyrics;
  const originalKey =
    raw.originalKey ?? raw.original_key;

  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof lyrics !== "string" ||
    typeof originalKey !== "string"
  ) {
    return null;
  }

  const now = new Date().toISOString();
  return {
    id,
    title: title.trim(),
    lyrics,
    originalKey: originalKey.trim() || "C",
    author: raw.author ? String(raw.author).trim() : undefined,
    creatorId: raw.creatorId
      ? String(raw.creatorId)
      : raw.creator_id
        ? String(raw.creator_id)
        : undefined,
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : typeof raw.created_at === "string"
          ? raw.created_at
          : now,
    updatedAt:
      typeof raw.updatedAt === "string"
        ? raw.updatedAt
        : typeof raw.updated_at === "string"
          ? raw.updated_at
          : now,
  };
}

function migrateHymns(hymns: Hymn[]): Hymn[] {
  const userId = getLocalUserId();
  let changed = false;

  const migrated = hymns.map((h) => {
    if (!h.creatorId && !h.id.startsWith("seed-")) {
      changed = true;
      return { ...h, creatorId: userId };
    }
    return h;
  });

  if (changed) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    } catch {
      // ignorar
    }
  }

  return migrated;
}

function readAll(): Hymn[] {
  if (typeof window === "undefined") return SEED_HYMNS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_HYMNS));
      return SEED_HYMNS;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_HYMNS));
      return SEED_HYMNS;
    }

    const hymns = migrateHymns(
      parsed
        .map((item) => sanitizeHymn(item as Record<string, unknown>))
        .filter((h): h is Hymn => h !== null)
    );

    if (hymns.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_HYMNS));
      return SEED_HYMNS;
    }

    return hymns;
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_HYMNS));
    } catch {
      // localStorage no disponible
    }
    return SEED_HYMNS;
  }
}

function writeAll(hymns: Hymn[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hymns));
  } catch {
    throw new Error(
      "No se pudo guardar en el dispositivo. Revisa el espacio o el modo privado del navegador."
    );
  }
}

export function getHymnsLocal(): Hymn[] {
  return readAll().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getHymnLocal(id: string): Hymn | undefined {
  return readAll().find((h) => h.id === id);
}

export function createHymnLocal(input: CreateHymnInput): Hymn {
  const hymns = readAll();
  const now = new Date().toISOString();
  const hymn: Hymn = {
    id: createId(),
    title: input.title.trim(),
    lyrics: input.lyrics.trim(),
    originalKey: input.originalKey.trim() || "C",
    author: input.author?.trim() || undefined,
    creatorId: getLocalUserId(),
    createdAt: now,
    updatedAt: now,
  };
  hymns.push(hymn);
  writeAll(hymns);
  return hymn;
}

export function updateHymnLocal(id: string, input: UpdateHymnInput): Hymn {
  const hymns = readAll();
  const index = hymns.findIndex((h) => h.id === id);
  if (index === -1) {
    throw new Error("Canción no encontrada.");
  }

  const existing = hymns[index];
  const userId = getLocalUserId();
  if (!existing.creatorId || existing.creatorId !== userId) {
    throw new Error("Solo el creador puede editar esta canción.");
  }

  const updated: Hymn = {
    ...existing,
    title: input.title.trim(),
    lyrics: input.lyrics.trim(),
    originalKey: input.originalKey.trim() || "C",
    author: input.author?.trim() || undefined,
    updatedAt: new Date().toISOString(),
  };

  hymns[index] = updated;
  writeAll(hymns);
  return updated;
}

export function deleteHymnLocal(id: string): boolean {
  const hymns = readAll();
  const filtered = hymns.filter((h) => h.id !== id);
  if (filtered.length === hymns.length) return false;
  writeAll(filtered);
  return true;
}
