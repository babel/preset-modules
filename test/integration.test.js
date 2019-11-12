import path from "path";
import { readdirSync } from "fs";
import { rollup } from "rollup";
import terser from "terser";
import babel from "rollup-plugin-babel";
import nodeResolve from "rollup-plugin-node-resolve";
import chalk from "chalk";
import bytes from "pretty-bytes";
import preset from "..";
import { compressedSize, writeFile, mkdirp } from "./_util";

jest.setTimeout(30000);

const FIXTURES = path.resolve(__dirname, "integration");

async function writeBeautified(filename, code) {
  await writeFile(
    filename,
    terser.minify(code, {
      mangle: false,
      compress: false,
      sourceMap: false,
      output: { beautify: true },
    }).code,
    () => {}
  );
}

const IGNORE_WARNINGS = [
  "UNRESOLVED_IMPORT",
  "MISSING_GLOBAL_NAME",
  "UNUSED_EXTERNAL_IMPORT",
];

async function compile(dir, babelOptions) {
  let pkg = {};
  try {
    pkg = require(path.resolve(dir, "package.json"));
  } catch (e) {}
  const bundle = await rollup({
    context: dir,
    input: path.resolve(dir, pkg.main || "index.js"),
    plugins: [
      nodeResolve({
        jail: dir,
      }),
      babelOptions !== false &&
        babel({
          babelrc: false,
          ...babelOptions,
        }),
    ].filter(Boolean),
    onwarn(warning, warn) {
      if (IGNORE_WARNINGS.indexOf(warning.code) === -1) warn(warning);
    },
  });
  const { output } = await bundle.generate({
    format: "iife",
  });
  return output[0].code;
}

describe("integration", () => {
  let summary = "";

  for (const f of readdirSync(FIXTURES)) {
    if (f[0] === ".") continue;
    it("should compile " + f + " to less code than preset-env", async () => {
      const context = path.resolve(FIXTURES, f);
      const before = await compile(context, {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-transform-react-jsx"],
      });
      const out = await compile(context, {
        presets: [preset],
        plugins: ["@babel/plugin-transform-react-jsx"],
      });
      const outEnv = await compile(context, {
        presets: [["@babel/preset-env", { targets: { esmodules: true } }]],
        plugins: ["@babel/plugin-transform-react-jsx"],
      });

      // write to disk for easy inspection: (ignore write errors in CI)
      try {
        mkdirp(path.join(context, ".dist"));
        writeBeautified(path.join(context, ".dist/preset-modules.js"), out);
        writeBeautified(path.join(context, ".dist/preset-env.js"), outEnv);
      } catch (e) {}

      const sizeBefore = await compressedSize(before, {
        module: false,
      });

      const size = await compressedSize(out, { module: false });

      const sizeEnv = await compressedSize(outEnv, {
        module: false,
      });

      summary += `\n${f}: ${bytes(size)}`;
      summary +=
        chalk.dim(
          `\n  → ${sizeEnv -
            size}b smaller than preset-env's targets.esmodules (`
        ) +
        chalk.green(`${(((sizeEnv - size) / sizeEnv) * 100) | 0}% savings`) +
        chalk.dim(`)`);
      summary +=
        chalk.dim(
          `\n  → ${sizeBefore - size}b smaller than preset-env's default (`
        ) +
        chalk.green(
          `${(((sizeBefore - size) / sizeBefore) * 100) | 0}% savings`
        ) +
        chalk.dim(`)`);
      expect(size).toBeLessThan(sizeEnv);
    });
  }

  afterAll(() => {
    console.log(
      chalk.blueBright(
        `Compared to @babel/preset-env's targets.esmodules output:`
      ) + summary
    );
  });
});
