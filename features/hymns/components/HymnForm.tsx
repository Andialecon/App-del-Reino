"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KEYS_MAJOR } from "@/features/hymns/utils/chords";
import { createHymn, updateHymn } from "@/features/hymns/storage";
import type { UpdateHymnInput } from "@/features/hymns/types";
import { Loading } from "@/components/ui/Loading";
import { cn } from "@/utils/cn";

interface HymnFormProps {
  mode: "create" | "edit";
  hymnId?: string;
  initial?: UpdateHymnInput;
}

export function HymnForm({ mode, hymnId, initial }: HymnFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [originalKey, setOriginalKey] = useState(initial?.originalKey ?? "C");
  const [lyrics, setLyrics] = useState(initial?.lyrics ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!lyrics.trim()) {
      setError("La letra es obligatoría.");
      return;
    }

    setSubmitting(true);
    try {
      const input = {
        title,
        lyrics,
        originalKey,
        author: author || undefined,
      };

      if (mode === "edit" && hymnId) {
        await updateHymn(hymnId, input);
        router.push(`/hymns/${hymnId}`);
      } else {
        const hymn = await createHymn(input);
        router.push(`/hymns/${hymn.id}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar la canción."
      );
      setSubmitting(false);
    }
  };

  if (submitting) {
    return <Loading label="Guardando..." className="py-16" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Editar canción" : "Nueva canción"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Usa formato ChordPro:{" "}
          <code className="text-xs bg-muted px-1 rounded">[C]Letra [G]aquí</code>
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl p-3">
          {error}
        </p>
      )}

      <Field label="Título" required>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nombre de la canción"
          className={inputClass}
        />
      </Field>

      <Field label="Autor">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Opcional"
          className={inputClass}
        />
      </Field>

      <Field label="Tonalidad original" required>
        <select
          value={originalKey}
          onChange={(e) => setOriginalKey(e.target.value)}
          className={inputClass}
        >
          {KEYS_MAJOR.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
          {KEYS_MAJOR.map((k) => (
            <option key={`${k}m`} value={`${k}m`}>{k}m</option>
          ))}
        </select>
      </Field>

      <Field
        label="Letra con acordes"
        required
        hint="Coloca acordes entre corchetes antes de cada frase."
      >
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows={14}
          placeholder={`[C]Santo, [G]santo, [Am]santo\n[C]Dios [F]poderoso [C]y [G]magnífico`}
          className={cn(inputClass, "resize-y min-h-[12rem] font-mono text-sm")}
        />
      </Field>

      <button
        type="submit"
        className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {mode === "edit" ? "Guardar cambios" : "Guardar canción"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
