import type { BibleBook } from "../types";

/** Catálogo local de los 66 libros (RV1960) con slugs de bible-api.deno.dev */
export const BIBLE_BOOKS: BibleBook[] = [
  { id: "genesis", name: "Génesis", abbrev: "Gn", chapters: 50, testament: "AT" },
  { id: "exodo", name: "Éxodo", abbrev: "Éx", chapters: 40, testament: "AT" },
  { id: "levitico", name: "Levítico", abbrev: "Lv", chapters: 27, testament: "AT" },
  { id: "numeros", name: "Números", abbrev: "Nm", chapters: 36, testament: "AT" },
  { id: "deuteronomio", name: "Deuteronomio", abbrev: "Dt", chapters: 34, testament: "AT" },
  { id: "josue", name: "Josué", abbrev: "Jos", chapters: 24, testament: "AT" },
  { id: "jueces", name: "Jueces", abbrev: "Jue", chapters: 21, testament: "AT" },
  { id: "rut", name: "Rut", abbrev: "Rt", chapters: 4, testament: "AT" },
  { id: "1-samuel", name: "1 Samuel", abbrev: "1 S", chapters: 31, testament: "AT" },
  { id: "2-samuel", name: "2 Samuel", abbrev: "2 S", chapters: 24, testament: "AT" },
  { id: "1-reyes", name: "1 Reyes", abbrev: "1 R", chapters: 22, testament: "AT" },
  { id: "2-reyes", name: "2 Reyes", abbrev: "2 R", chapters: 25, testament: "AT" },
  { id: "1-cronicas", name: "1 Crónicas", abbrev: "1 Cr", chapters: 29, testament: "AT" },
  { id: "2-cronicas", name: "2 Crónicas", abbrev: "2 Cr", chapters: 36, testament: "AT" },
  { id: "esdras", name: "Esdras", abbrev: "Esd", chapters: 10, testament: "AT" },
  { id: "nehemias", name: "Nehemías", abbrev: "Neh", chapters: 13, testament: "AT" },
  { id: "ester", name: "Ester", abbrev: "Est", chapters: 10, testament: "AT" },
  { id: "job", name: "Job", abbrev: "Job", chapters: 42, testament: "AT" },
  { id: "salmos", name: "Salmos", abbrev: "Sal", chapters: 150, testament: "AT" },
  { id: "proverbios", name: "Proverbios", abbrev: "Pr", chapters: 31, testament: "AT" },
  { id: "eclesiastes", name: "Eclesiastés", abbrev: "Ec", chapters: 12, testament: "AT" },
  { id: "cantares", name: "Cantares", abbrev: "Cnt", chapters: 8, testament: "AT" },
  { id: "isaias", name: "Isaías", abbrev: "Is", chapters: 66, testament: "AT" },
  { id: "jeremias", name: "Jeremías", abbrev: "Jer", chapters: 52, testament: "AT" },
  { id: "lamentaciones", name: "Lamentaciones", abbrev: "Lm", chapters: 5, testament: "AT" },
  { id: "ezequiel", name: "Ezequiel", abbrev: "Ez", chapters: 48, testament: "AT" },
  { id: "daniel", name: "Daniel", abbrev: "Dn", chapters: 12, testament: "AT" },
  { id: "oseas", name: "Oseas", abbrev: "Os", chapters: 14, testament: "AT" },
  { id: "joel", name: "Joel", abbrev: "Jl", chapters: 3, testament: "AT" },
  { id: "amos", name: "Amós", abbrev: "Am", chapters: 9, testament: "AT" },
  { id: "abdias", name: "Abdías", abbrev: "Abd", chapters: 1, testament: "AT" },
  { id: "jonas", name: "Jonás", abbrev: "Jon", chapters: 4, testament: "AT" },
  { id: "miqueas", name: "Miqueas", abbrev: "Mi", chapters: 7, testament: "AT" },
  { id: "nahum", name: "Nahúm", abbrev: "Nah", chapters: 3, testament: "AT" },
  { id: "habacuc", name: "Habacuc", abbrev: "Hab", chapters: 3, testament: "AT" },
  { id: "sofonias", name: "Sofonías", abbrev: "Sof", chapters: 3, testament: "AT" },
  { id: "hageo", name: "Hageo", abbrev: "Hag", chapters: 2, testament: "AT" },
  { id: "zacarias", name: "Zacarías", abbrev: "Zac", chapters: 14, testament: "AT" },
  { id: "malaquias", name: "Malaquías", abbrev: "Mal", chapters: 4, testament: "AT" },
  { id: "mateo", name: "Mateo", abbrev: "Mt", chapters: 28, testament: "NT" },
  { id: "marcos", name: "Marcos", abbrev: "Mr", chapters: 16, testament: "NT" },
  { id: "lucas", name: "Lucas", abbrev: "Lc", chapters: 24, testament: "NT" },
  { id: "juan", name: "Juan", abbrev: "Jn", chapters: 21, testament: "NT" },
  { id: "hechos", name: "Hechos", abbrev: "Hch", chapters: 28, testament: "NT" },
  { id: "romanos", name: "Romanos", abbrev: "Ro", chapters: 16, testament: "NT" },
  { id: "1-corintios", name: "1 Corintios", abbrev: "1 Co", chapters: 16, testament: "NT" },
  { id: "2-corintios", name: "2 Corintios", abbrev: "2 Co", chapters: 13, testament: "NT" },
  { id: "galatas", name: "Gálatas", abbrev: "Gá", chapters: 6, testament: "NT" },
  { id: "efesios", name: "Efesios", abbrev: "Ef", chapters: 6, testament: "NT" },
  { id: "filipenses", name: "Filipenses", abbrev: "Fil", chapters: 4, testament: "NT" },
  { id: "colosenses", name: "Colosenses", abbrev: "Col", chapters: 4, testament: "NT" },
  { id: "1-tesalonicenses", name: "1 Tesalonicenses", abbrev: "1 Ts", chapters: 5, testament: "NT" },
  { id: "2-tesalonicenses", name: "2 Tesalonicenses", abbrev: "2 Ts", chapters: 3, testament: "NT" },
  { id: "1-timoteo", name: "1 Timoteo", abbrev: "1 Ti", chapters: 6, testament: "NT" },
  { id: "2-timoteo", name: "2 Timoteo", abbrev: "2 Ti", chapters: 4, testament: "NT" },
  { id: "tito", name: "Tito", abbrev: "Tit", chapters: 3, testament: "NT" },
  { id: "filemon", name: "Filemón", abbrev: "Flm", chapters: 1, testament: "NT" },
  { id: "hebreos", name: "Hebreos", abbrev: "He", chapters: 13, testament: "NT" },
  { id: "santiago", name: "Santiago", abbrev: "Stg", chapters: 5, testament: "NT" },
  { id: "1-pedro", name: "1 Pedro", abbrev: "1 P", chapters: 5, testament: "NT" },
  { id: "2-pedro", name: "2 Pedro", abbrev: "2 P", chapters: 3, testament: "NT" },
  { id: "1-juan", name: "1 Juan", abbrev: "1 Jn", chapters: 5, testament: "NT" },
  { id: "2-juan", name: "2 Juan", abbrev: "2 Jn", chapters: 1, testament: "NT" },
  { id: "3-juan", name: "3 Juan", abbrev: "3 Jn", chapters: 1, testament: "NT" },
  { id: "judas", name: "Judas", abbrev: "Jud", chapters: 1, testament: "NT" },
  { id: "apocalipsis", name: "Apocalipsis", abbrev: "Ap", chapters: 22, testament: "NT" },
];

export function getBooksByTestament(testament: BibleBook["testament"]): BibleBook[] {
  return BIBLE_BOOKS.filter((b) => b.testament === testament);
}

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.id === id);
}

/** ID numérico canónico (1–66) usado por bolls.life para NIV */
export function getBollsBookId(id: string): number | undefined {
  const index = BIBLE_BOOKS.findIndex((b) => b.id === id);
  return index >= 0 ? index + 1 : undefined;
}
