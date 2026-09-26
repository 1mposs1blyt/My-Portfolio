#!/usr/bin/env node
/**
 * cleaner.mjs — удаляет комментарии из TS/TSX/JS/JSX через AST.
 *
 *   node cleaner.mjs --dry     посмотреть, что изменится
 *   node cleaner.mjs           применить
 *
 * Не трогает: node_modules, dist, build, .next, сгенерированный код
 * (generated, __generated__), .d.ts-файлы и всё, что не входит в TARGETS.
 *
 * Сохраняет функциональные комментарии — см. KEEP ниже.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { parse } from "@babel/parser";
import generateModule from "@babel/generator";

// @babel/generator 7.x кладёт функцию в .default, 8.x отдаёт её напрямую
const generate =
  typeof generateModule === "function" ? generateModule : generateModule.default;

/* ── настройка ─────────────────────────────────────── */

const ROOT = process.cwd();

const TARGETS = ["nestjs-app/src", "react-app/src"];

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".vite",
  "generated",
  "__generated__",
]);

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

/**
 * Комментарии, которые нельзя удалять: они управляют инструментами,
 * а не объясняют код.
 */
const KEEP = [
  /^\s*@ts-(expect-error|ignore|nocheck)/,
  /^\s*eslint-disable/,
  /^\s*eslint-enable/,
  /^\s*prettier-ignore/,
  /^\s*global\s/,
  /^\s*<reference\s/,
  /^\s*@license/,
  /^\s*@preserve/,
  /^!/,
  /^\s*#__PURE__/,
  /^\s*webpackChunkName/,
  /^\s*vite-ignore/,
];

const DRY = process.argv.includes("--dry");

/* ── обход файлов ──────────────────────────────────── */

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;

    const full = join(dir, entry);
    const stats = statSync(full);

    if (stats.isDirectory()) {
      walk(full, out);
      continue;
    }

    if (!EXTENSIONS.has(extname(entry))) continue;
    if (entry.endsWith(".d.ts")) continue;

    out.push(full);
  }

  return out;
}

/* ── обработка одного файла ────────────────────────── */

function stripFile(file) {
  const source = readFileSync(file, "utf8");

  const ast = parse(source, {
    sourceType: "module",
    allowReturnOutsideFunction: true,
    plugins: [
      "typescript",
      "jsx",
      "decorators-legacy",
      "classProperties",
      "topLevelAwait",
      "importAttributes",
    ],
  });

  const { code } = generate(ast, {
    retainLines: false,
    comments: true,
    shouldPrintComment: (value) => KEEP.some((re) => re.test(value)),
    jsescOption: { minimal: true },
  });

  return { source, code };
}

/* ── запуск ────────────────────────────────────────── */

const files = TARGETS.flatMap((t) => walk(join(ROOT, t)));

if (files.length === 0) {
  console.error(
    `Не найдено файлов. Запускай из корня репозитория, ожидаемые папки: ${TARGETS.join(", ")}`,
  );
  process.exit(1);
}

let changed = 0;
let failed = 0;

for (const file of files) {
  const short = relative(ROOT, file).split(sep).join("/");

  try {
    const { source, code } = stripFile(file);

    if (code === source) continue;

    changed++;
    if (DRY) {
      const removed = source.split("\n").length - code.split("\n").length;
      console.log(`  ${short}  (строк меньше на ${removed})`);
    } else {
      writeFileSync(file, code, "utf8");
    }
  } catch (e) {
    failed++;
    console.error(`  ОШИБКА  ${short}: ${e.message}`);
  }
}

console.log(
  `\n${DRY ? "Будет изменено" : "Изменено"}: ${changed} из ${files.length}` +
    (failed ? `, с ошибками: ${failed}` : ""),
);

if (!DRY && changed) {
  console.log('Дальше: npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"');
}
