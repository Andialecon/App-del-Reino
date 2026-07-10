"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  BIBLE_VERSION_DEFINITIONS,
  type BibleVersionCode,
} from "@/features/bible/types";
import { useBibleLabels } from "@/hooks/useBibleLabels";
import { useDismissOnOutside } from "@/hooks/useDismissOnOutside";
import { cn } from "@/utils/cn";

interface VersionSwitcherProps {
  value: BibleVersionCode;
  onChange: (version: BibleVersionCode) => void;
}

function VersionOption({
  code,
  isSelected,
  onSelect,
}: {
  code: BibleVersionCode;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { versionMeta } = useBibleLabels();
  const meta = versionMeta(code);

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
        isSelected
          ? "bg-amber-100 text-amber-950 dark:bg-amber-900/50 dark:text-amber-50"
          : "hover:bg-accent"
      )}
    >
      <div className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-tight">
          {meta.shortName}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {meta.name}
        </span>
      </div>
      {isSelected && (
        <Check
          size={16}
          className="shrink-0 text-amber-600 dark:text-amber-400"
          aria-hidden
        />
      )}
    </button>
  );
}

export function VersionSwitcher({ value, onChange }: VersionSwitcherProps) {
  const { t, versionMeta } = useBibleLabels();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = versionMeta(value);

  const spanishVersions = BIBLE_VERSION_DEFINITIONS.filter(
    (def) => def.language === "es"
  );
  const englishVersions = BIBLE_VERSION_DEFINITIONS.filter(
    (def) => def.language === "en"
  );

  const close = useCallback(() => setOpen(false), []);
  useDismissOnOutside(rootRef, open, close);

  const handleSelect = (code: BibleVersionCode) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="min-w-0 truncate">
          <span className="font-bold">{selected.shortName}</span>
          <span className="text-muted-foreground"> · {selected.name}</span>
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={t("bible.versionLabel")}
          className="absolute left-0 right-0 z-20 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-lg animate-scale-in"
        >
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
            {t("language.es")}
          </p>
          {spanishVersions.map((def) => (
            <VersionOption
              key={def.code}
              code={def.code}
              isSelected={value === def.code}
              onSelect={() => handleSelect(def.code)}
            />
          ))}

          <p className="mt-1.5 px-2.5 pb-1 pt-1.5 text-[11px] font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">
            {t("language.en")}
          </p>
          {englishVersions.map((def) => (
            <VersionOption
              key={def.code}
              code={def.code}
              isSelected={value === def.code}
              onSelect={() => handleSelect(def.code)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
