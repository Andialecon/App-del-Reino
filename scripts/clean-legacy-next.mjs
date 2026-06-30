import { existsSync, rmSync } from "fs";
import { join } from "path";

/** Carpetas de caché que OneDrive puede corromper. */
const DIRS_TO_CLEAN = [
  ".next",
  ".next-dev",
  "next-build",
  "node_modules/.cache",
];

function removeDir(relativePath) {
  const fullPath = join(process.cwd(), relativePath);
  if (!existsSync(fullPath)) return;

  try {
    rmSync(fullPath, { recursive: true, force: true, maxRetries: 10 });
    console.log(`Eliminada: ${relativePath}`);
  } catch {
    console.warn(
      `No se pudo eliminar ${relativePath}. Cierra todos los servidores (npm run dev / npm start) y vuelve a intentar.`
    );
  }
}

for (const dir of DIRS_TO_CLEAN) {
  removeDir(dir);
}

console.log("Limpieza completada.");
