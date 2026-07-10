"use client";

import type { BibleBook, BibleVersionCode } from "@/features/bible/types";
import { useTranslation } from "@/components/providers/LocaleProvider";

export function useBibleLabels() {
  const { t } = useTranslation();

  const testamentLabel = (id: "AT" | "NT") =>
    id === "AT" ? t("bible.oldTestament") : t("bible.newTestament");

  const bookName = (book: BibleBook) => {
    const translated = t(`bible.books.${book.id}`);
    return translated.startsWith("bible.books.") ? book.name : translated;
  };

  const versionMeta = (code: BibleVersionCode) => ({
    shortName: t(`bible.versions.${code}.shortName`),
    name: t(`bible.versions.${code}.name`),
  });

  const chapterLabel = (count: number) =>
    `${count} ${count === 1 ? t("bible.chapterOne") : t("bible.chapterMany")}`;

  return {
    t,
    testamentLabel,
    bookName,
    versionMeta,
    chapterLabel,
  };
}
