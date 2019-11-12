import { promisify } from "util";
import fs, { mkdir } from "fs";
import path from "path";
import { transform } from "@babel/core";
import gzipSize from "gzip-size";
import terser from "terser";
import chalk from "chalk";

const options = {
  babelrc: false,
  configFile: false,
  sourceType: "module",
  compact: true,
};

export function dent(...args) {
  const str = args[0].reduce((acc, str, index) => acc + args[index] + str);
  const whitespace = str.match(/([\t ]*)[^\s\n]/m)[1];
  return str
    .replace(new RegExp("^" + whitespace, "gm"), "")
    .trim()
    .replace(/\t/g, "  ");
}

export function babel(code, config) {
  return transform(code, {
    ...options,
    ...config,
  })
    .code.replace(/\n\n+/g, "\n")
    .trim();
}

export function compressedSize(code, options = {}) {
  return gzipSize(
    terser.minify(code, {
      mangle: true,
      compress: true,
      sourceMap: false,
      module: true,
      ecma: 8,
      ...options,
    }).code
  );
}

export const readdir = promisify(fs.readdir);
export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export function mkdirp(f) {
  return promisify(mkdir)(f).catch(() => {});
}

export async function compareFixturesToPresetEnv(
  dir,
  { compileBefore, compile, compileEnv },
  assertion
) {
  let summary = "";
  let count = 0,
    total = 0,
    sum = 0,
    sumEnv = 0;
  for (const f of await readdir(dir)) {
    if (!/\.js$/.test(f)) continue;
    const fixture = f.replace(/\.js$/, "");
    const context = {
      fixture,
      dir: path.join(dir, f),
    };
    try {
      context.file = await readFile(path.join(dir, f), "utf-8");
    } catch (e) {}
    const before = compileBefore ? await compileBefore(context) : context.file;
    const out = await compile(context);
    const outEnv = await compileEnv(context);
    count++;
    const sizeBefore = (total += await compressedSize(before));
    const size = (sum += await compressedSize(out));
    const sizeEnv = (sumEnv += await compressedSize(outEnv));
    summary +=
      `\n  ${fixture}: ${size}b` +
      chalk.dim(` → ${sizeEnv - size}b smaller than env (`) +
      chalk.green(`${(((sizeEnv - size) / sizeEnv) * 100) | 0}% savings`) +
      chalk.dim`)`;
    if (assertion) {
      assertion({ fixture, size, sizeEnv, sizeBefore, before, out, outEnv });
    }
  }
  summary += chalk.magenta(
    `\nAverage Savings of ${((sumEnv - sum) / count) |
      0}b compared to preset-env (${((sum / total - 1) * 100) |
      0}% overhead versus ${((sumEnv / total - 1) * 100) | 0}%)`
  );
  return summary;
}
