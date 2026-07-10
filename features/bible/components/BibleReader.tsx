"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookMarked,
  BookOpen,
  ChevronLeft,
  ScrollText,
} from "lucide-react";
import { fetchChapter } from "@/features/bible/api";
import { SelectableTranslation } from "@/features/bible/components/SelectableTranslation";
import { VersionSwitcher } from "@/features/bible/components/VersionSwitcher";
import { getBookById, getBooksByTestament } from "@/features/bible/data/books";
import {
  getBibleVersionDef,
  type BibleBook,
  type BibleChapter,
  type BibleVersionCode,
  type TestamentId,
} from "@/features/bible/types";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBibleLabels } from "@/hooks/useBibleLabels";
import { useBibleVersion } from "@/hooks/useBibleVersion";
import { cn } from "@/utils/cn";

type Step = "testament" | "book" | "chapter" | "verse" | "read";

function StepHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}) {
  const { t } = useBibleLabels();

  return (
    <div className="flex items-start gap-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent"
          aria-label={t("common.back")}
        >
          <ChevronLeft size={18} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold leading-tight">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function Breadcrumb({
  items,
  onNavigate,
}: {
  items: { label: string; step: Step }[];
  onNavigate: (step: Step) => void;
}) {
  const { t } = useBibleLabels();

  if (items.length === 0) return null;

  return (
    <nav
      aria-label={t("bible.passageNav")}
      className="flex flex-wrap items-center gap-1.5"
    >
      {items.map((item, index) => (
        <div key={item.step} className="flex items-center gap-1.5">
          {index > 0 && (
            <span className="text-muted-foreground/60" aria-hidden>
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => onNavigate(item.step)}
            className={cn(
              "rounded-lg px-2 py-1 text-xs font-medium transition-colors",
              index === items.length - 1
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        </div>
      ))}
    </nav>
  );
}

function NumberGrid({
  count,
  onSelect,
  selected,
}: {
  count: number;
  onSelect: (n: number) => void;
  selected?: number | null;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onSelect(n)}
          className={cn(
            "flex h-12 items-center justify-center rounded-xl border text-sm font-semibold transition-all active:scale-95",
            selected === n
              ? "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/25"
              : "border-border bg-card text-foreground hover:border-amber-300 hover:bg-amber-50 dark:hover:border-amber-700 dark:hover:bg-amber-950/40"
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function TestamentStep({
  version,
  onVersionChange,
  onSelect,
}: {
  version: BibleVersionCode;
  onVersionChange: (version: BibleVersionCode) => void;
  onSelect: (id: TestamentId) => void;
}) {
  const { t, testamentLabel, versionMeta } = useBibleLabels();

  const options: {
    id: TestamentId;
    icon: typeof BookMarked;
    hintKey: "bible.otHint" | "bible.ntHint";
    accent: string;
  }[] = [
    {
      id: "AT",
      icon: ScrollText,
      hintKey: "bible.otHint",
      accent:
        "from-amber-50 to-orange-50/80 hover:border-amber-400 dark:from-amber-950/40 dark:to-orange-950/20 dark:hover:border-amber-600",
    },
    {
      id: "NT",
      icon: BookOpen,
      hintKey: "bible.ntHint",
      accent:
        "from-sky-50 to-indigo-50/80 hover:border-sky-400 dark:from-sky-950/40 dark:to-indigo-950/20 dark:hover:border-sky-600",
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <StepHeader
        title={t("bible.title")}
        subtitle={versionMeta(version).name}
      />
      <VersionSwitcher value={version} onChange={onVersionChange} />
      <p className="text-sm text-muted-foreground">{t("bible.testamentQuestion")}</p>
      <div className="grid gap-3">
        {options.map(({ id, icon: Icon, hintKey, accent }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              "group flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br p-4 text-left shadow-sm transition-all active:scale-[0.98]",
              accent
            )}
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-amber-700 shadow-sm dark:bg-white/10 dark:text-amber-300">
              <Icon size={26} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold">{testamentLabel(id)}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{t(hintKey)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BookListStep({
  testament,
  versionLabel,
  onSelect,
  onBack,
  onNavigate,
}: {
  testament: TestamentId;
  versionLabel: string;
  onSelect: (book: BibleBook) => void;
  onBack: () => void;
  onNavigate: (step: Step) => void;
}) {
  const { t, testamentLabel, bookName, chapterLabel } = useBibleLabels();
  const books = getBooksByTestament(testament);
  const testamentName = testamentLabel(testament);

  return (
    <div className="space-y-4 animate-fade-in">
      <StepHeader
        title={t("bible.booksTitle")}
        subtitle={`${testamentName} · ${versionLabel}`}
        onBack={onBack}
      />
      <Breadcrumb
        items={[{ label: testamentName, step: "testament" }]}
        onNavigate={onNavigate}
      />
      <ul className="space-y-2">
        {books.map((book, index) => (
          <li
            key={book.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
          >
            <button
              type="button"
              onClick={() => onSelect(book)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition-all hover:border-amber-300 hover:shadow-md active:scale-[0.99] dark:hover:border-amber-700"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                {book.abbrev}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{bookName(book)}</span>
                <span className="text-xs text-muted-foreground">
                  {chapterLabel(book.chapters)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChapterStep({
  book,
  testament,
  onSelect,
  onBack,
  onNavigate,
}: {
  book: BibleBook;
  testament: TestamentId;
  onSelect: (chapter: number) => void;
  onBack: () => void;
  onNavigate: (step: Step) => void;
}) {
  const { t, testamentLabel, bookName } = useBibleLabels();
  const name = bookName(book);

  return (
    <div className="space-y-4 animate-fade-in">
      <StepHeader title={t("bible.chapters")} subtitle={name} onBack={onBack} />
      <Breadcrumb
        items={[
          { label: testamentLabel(testament), step: "testament" },
          { label: name, step: "book" },
        ]}
        onNavigate={onNavigate}
      />
      <NumberGrid count={book.chapters} onSelect={onSelect} />
    </div>
  );
}

function VerseStep({
  book,
  chapter,
  testament,
  verseCount,
  loading,
  error,
  onSelectAll,
  onSelectVerse,
  onBack,
  onNavigate,
  onRetry,
}: {
  book: BibleBook;
  chapter: number;
  testament: TestamentId;
  verseCount: number;
  loading: boolean;
  error: string | null;
  onSelectAll: () => void;
  onSelectVerse: (verse: number) => void;
  onBack: () => void;
  onNavigate: (step: Step) => void;
  onRetry: () => void;
}) {
  const { t, testamentLabel, bookName } = useBibleLabels();
  const name = bookName(book);

  return (
    <div className="space-y-4 animate-fade-in">
      <StepHeader
        title={t("bible.verses")}
        subtitle={`${name} ${chapter}`}
        onBack={onBack}
      />
      <Breadcrumb
        items={[
          { label: testamentLabel(testament), step: "testament" },
          { label: name, step: "book" },
          { label: `${t("bible.chapterShort")} ${chapter}`, step: "chapter" },
        ]}
        onNavigate={onNavigate}
      />

      {loading && (
        <Loading label={t("bible.loadingVerses")} className="py-12" />
      )}

      {!loading && error && (
        <div className="space-y-3">
          <EmptyState
            icon={BookOpen}
            title={t("bible.loadError")}
            description={error}
          />
          <button
            type="button"
            onClick={onRetry}
            className="mx-auto block rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            {t("common.retry")}
          </button>
        </div>
      )}

      {!loading && !error && verseCount > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={onSelectAll}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 py-3.5 text-sm font-semibold text-amber-900 transition-all hover:bg-amber-100 active:scale-[0.99] dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-900/50"
          >
            <BookOpen size={18} />
            {t("bible.readFullChapter")}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            {t("bible.orPickVerse")}
          </p>
          <NumberGrid count={verseCount} onSelect={onSelectVerse} />
        </div>
      )}
    </div>
  );
}

function ReadStep({
  book,
  chapter,
  verse,
  testament,
  version,
  data,
  onBack,
  onNavigate,
  onChangeVerse,
  onVersionChange,
}: {
  book: BibleBook;
  chapter: number;
  verse: number | null;
  testament: TestamentId;
  version: BibleVersionCode;
  data: BibleChapter;
  onBack: () => void;
  onNavigate: (step: Step) => void;
  onChangeVerse: (verse: number | null) => void;
  onVersionChange: (version: BibleVersionCode) => void;
}) {
  const { t, testamentLabel, bookName, versionMeta } = useBibleLabels();
  const name = bookName(book);
  const versionDef = getBibleVersionDef(version);
  const targetLang = versionDef.language === "es" ? "en" : "es";

  const displayed = useMemo(() => {
    if (verse == null) return data.verses;
    return data.verses.filter((v) => v.number === verse);
  }, [data.verses, verse]);

  const reference =
    verse != null ? `${name} ${chapter}:${verse}` : `${name} ${chapter}`;

  return (
    <div className="space-y-4 animate-fade-in">
      <StepHeader
        title={reference}
        subtitle={versionMeta(version).name}
        onBack={onBack}
      />
      <VersionSwitcher value={version} onChange={onVersionChange} />
      <Breadcrumb
        items={[
          { label: testamentLabel(testament), step: "testament" },
          { label: name, step: "book" },
          { label: `${t("bible.chapterShort")} ${chapter}`, step: "chapter" },
          {
            label:
              verse != null
                ? `${t("bible.verseShort")} ${verse}`
                : t("bible.full"),
            step: "verse",
          },
        ]}
        onNavigate={onNavigate}
      />

      {verse == null && (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => onChangeVerse(null)}
            className="shrink-0 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white"
          >
            {t("bible.all")}
          </button>
          {data.verses.map((v) => (
            <button
              key={v.number}
              type="button"
              onClick={() => onChangeVerse(v.number)}
              className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-amber-300 hover:text-foreground"
            >
              {v.number}
            </button>
          ))}
        </div>
      )}

      <article className="rounded-2xl border border-border bg-gradient-to-b from-amber-50/40 via-card to-card p-5 shadow-sm dark:from-amber-950/20">
        <SelectableTranslation
          sourceLang={versionDef.language}
          targetLang={targetLang}
          className="space-y-4"
        >
          {displayed.map((v) => (
            <p key={v.number} className="text-[16px] leading-[1.75]">
              {v.study && (
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  {v.study}
                </span>
              )}
              <button
                type="button"
                onClick={() => onChangeVerse(v.number)}
                className="mr-1.5 inline align-super text-xs font-bold text-amber-600 hover:underline dark:text-amber-400"
                aria-label={t("bible.verseLabel", { number: v.number })}
              >
                {v.number}
              </button>
              {v.text}
            </p>
          ))}
        </SelectableTranslation>
      </article>

      {verse != null && (
        <button
          type="button"
          onClick={() => onChangeVerse(null)}
          className="w-full rounded-xl border border-border bg-card py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {t("bible.viewFullChapter")}
        </button>
      )}
    </div>
  );
}

export function BibleReader() {
  const { t, versionMeta } = useBibleLabels();
  const { version, setVersion } = useBibleVersion();
  const [step, setStep] = useState<Step>("testament");
  const [testament, setTestament] = useState<TestamentId | null>(null);
  const [bookId, setBookId] = useState<string | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [verse, setVerse] = useState<number | null>(null);
  const [data, setData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);

  const book = bookId ? getBookById(bookId) : undefined;
  const versionShortName = versionMeta(version).shortName;

  useEffect(() => {
    if (step !== "verse" && step !== "read") return;
    if (!bookId || chapter == null) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchChapter(bookId!, chapter!, version);
        if (!cancelled) {
          setData(result);
          if (verse != null && !result.verses.some((v) => v.number === verse)) {
            setVerse(null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(
            err instanceof Error ? err.message : t("bible.loadErrorGeneric")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
    // verse intentionally omitted: only validate after load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, chapter, step, loadKey, version]);

  function handleVersionChange(next: BibleVersionCode) {
    if (next === version) return;
    setVersion(next);
    if (step === "verse" || step === "read") {
      setData(null);
      setLoadKey((k) => k + 1);
    }
  }

  function goToStep(next: Step) {
    if (next === "testament") {
      setTestament(null);
      setBookId(null);
      setChapter(null);
      setVerse(null);
      setData(null);
      setError(null);
    } else if (next === "book") {
      setBookId(null);
      setChapter(null);
      setVerse(null);
      setData(null);
      setError(null);
    } else if (next === "chapter") {
      setChapter(null);
      setVerse(null);
      setData(null);
      setError(null);
    } else if (next === "verse") {
      setVerse(null);
    }
    setStep(next);
  }

  if (step === "testament") {
    return (
      <TestamentStep
        version={version}
        onVersionChange={handleVersionChange}
        onSelect={(id) => {
          setTestament(id);
          setStep("book");
        }}
      />
    );
  }

  if (step === "book" && testament) {
    return (
      <BookListStep
        testament={testament}
        versionLabel={versionShortName}
        onBack={() => goToStep("testament")}
        onNavigate={goToStep}
        onSelect={(selected) => {
          setBookId(selected.id);
          setStep("chapter");
        }}
      />
    );
  }

  if (step === "chapter" && testament && book) {
    return (
      <ChapterStep
        book={book}
        testament={testament}
        onBack={() => goToStep("book")}
        onNavigate={goToStep}
        onSelect={(n) => {
          setChapter(n);
          setData(null);
          setStep("verse");
        }}
      />
    );
  }

  if (step === "verse" && testament && book && chapter != null) {
    return (
      <VerseStep
        book={book}
        chapter={chapter}
        testament={testament}
        verseCount={data?.verses.length ?? 0}
        loading={loading}
        error={error}
        onBack={() => goToStep("chapter")}
        onNavigate={goToStep}
        onRetry={() => setLoadKey((k) => k + 1)}
        onSelectAll={() => {
          setVerse(null);
          setStep("read");
        }}
        onSelectVerse={(n) => {
          setVerse(n);
          setStep("read");
        }}
      />
    );
  }

  if (step === "read" && testament && book && chapter != null) {
    if (loading || !data) {
      return <Loading label={t("bible.loadingPassage")} className="py-16" />;
    }

    return (
      <ReadStep
        book={book}
        chapter={chapter}
        verse={verse}
        testament={testament}
        version={version}
        data={data}
        onBack={() => goToStep("verse")}
        onNavigate={goToStep}
        onChangeVerse={setVerse}
        onVersionChange={handleVersionChange}
      />
    );
  }

  return (
    <EmptyState
      icon={BookOpen}
      title={t("bible.title")}
      description={t("bible.pickPassage")}
    />
  );
}
