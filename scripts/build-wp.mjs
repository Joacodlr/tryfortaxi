/**
 * Arma el tema de WordPress:  npm run build:wp  →  ../tomyd-wordpress-theme.zip
 * Se instala en WordPress → Apariencia → Temas → Añadir nuevo → Subir tema.
 */
import { build } from "vite";
import { cpSync, rmSync, renameSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const SLUG = "tomyd";
const root = resolve(import.meta.dirname, "..");
const stage = resolve(root, "dist-wp");
const out = resolve(stage, SLUG);
const zip = resolve(root, "..", "tomyd-wordpress-theme.zip");

// ?rest_route= funciona con cualquier configuración de enlaces permanentes.
process.env.VITE_RECLAMO_URL = "/?rest_route=/tomyd/v1/reclamo";
rmSync(stage, { recursive: true, force: true });

await build({
  root,
  base: `/wp-content/themes/${SLUG}/`,
  build: { outDir: out, emptyOutDir: true },
  logLevel: "warn",
});

// En WordPress no van el .htaccess ni el PHP suelto: el tema lo reemplaza.
rmSync(resolve(out, ".htaccess"), { force: true });
rmSync(resolve(out, "api"), { recursive: true, force: true });
renameSync(resolve(out, "index.html"), resolve(out, "app.html"));
cpSync(resolve(root, "wp-theme"), out, { recursive: true });

if (existsSync(zip)) rmSync(zip);
// tar.exe de Windows (bsdtar) sabe crear .zip; el de Git Bash no.
const tar = process.platform === "win32" ? resolve(process.env.SystemRoot ?? "C:/Windows", "System32/tar.exe") : "tar";
execFileSync(tar, ["-a", "-c", "-f", "../../tomyd-wordpress-theme.zip", SLUG], { cwd: stage });
console.log("Tema listo:", zip);
