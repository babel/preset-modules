import path from "path";
import {
  babel,
  readdir,
  readFile,
  compressedSize,
  compareFixturesToPresetEnv,
} from "./_util";
import chalk from "chalk";
import preset from "..";

function dedent(strings, ...expr) {
  const s = strings.reduce((acc, s, i) => acc + expr[i - 1] + s);
  const dent = s.match(/^(\t| {2,})+/m)[0];
  return s.trim().replace(new RegExp("^" + dent, "gm"), "");
}

function babelPretty(code) {
  return babel(code, { presets: [preset], compact: false, retainLines: true });
}

describe("@babel/preset-modules", () => {
  it("should assert Babel 7", () => {
    expect(preset).toEqual(expect.any(Function));
    const assertVersion = jest.fn();
    preset(
      {
        assertVersion,
      },
      {}
    );
    expect(assertVersion).toHaveBeenCalledWith(7);
  });

  it("should return a configuration object with plugins", () => {
    expect(preset).toEqual(expect.any(Function));
    const config = preset(
      {
        assertVersion() {},
      },
      {}
    );
    expect(config).toHaveProperty("plugins");
    expect(config.plugins).toEqual(expect.any(Array));
  });

  it("should pass a smoke test", () => {
    expect(
      babelPretty(dedent`
			const foo = async (tag, { a = 1 }, { data: { props = 1 } }, ...children) => {
				return a;
			};

			const ignoreMe = () => {
				const { a = 1 } = {};
			};
		`)
    ).toMatchSnapshot();
  });

  it("should produce minimal output", async () => {
    for (const f of await readdir(path.join(__dirname, "fixtures"))) {
      if (!/\.js$/.test(f)) continue;
      const file = await readFile(path.join(__dirname, "fixtures", f), "utf-8");
      const out = babel(file, { presets: [preset] });
      const sizeBefore = await compressedSize(file);
      const size = await compressedSize(out);
      const fixture = f.replace(/\.js$/, "");
      const title = `Fixture - ${fixture}:`;
      const delta = size - sizeBefore;
      const diff = (((size - sizeBefore) / (sizeBefore || 1)) * 100) | 0;
      const multiplier = (size / (sizeBefore || 1)).toFixed(2);
      const sign = delta >= 0 ? "+" : "";
      const stats = delta
        ? dedent`
          ${title}
          • ${size}b (${sign}${delta}b from original ${sizeBefore}b)
          • ${multiplier}x original size, a ${diff}% difference
        `
        : dedent`
          ${title}
          • ${size}b (no change)
        `;
      const snap = stats + `\nCode:\n${out.replace(/^/gm, "> ")}\n`;
      expect(snap).toMatchSnapshot(fixture);
    }
  });

  it("should be smaller than preset-env default", async () => {
    const out = await compareFixturesToPresetEnv(
      path.join(__dirname, "browser/fixtures"),
      {
        compile: ({ file }) => babel(file, { presets: [preset] }),
        compileEnv: ({ file }) =>
          babel(file, { presets: ["@babel/preset-env"] }),
        assertion: ({ size, sizeEnv }) => expect(size).toBeLessThan(sizeEnv),
      }
    );
    console.log(
      chalk.blueBright(`Compared to @babel/preset-env's default output:`) + out
    );
  });

  it("should be smaller than preset-env targets.esmodules", async () => {
    const out = await compareFixturesToPresetEnv(
      path.join(__dirname, "browser/fixtures"),
      {
        compile: ({ file }) => babel(file, { presets: [preset] }),
        compileEnv: ({ file }) =>
          babel(file, {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: { esmodules: true },
                },
              ],
            ],
          }),
        assertion: ({ size, sizeEnv }) => expect(size).toBeLessThan(sizeEnv),
      }
    );
    console.log(
      chalk.blueBright(
        `Compared to @babel/preset-env's targets.esmodules output:`
      ) + out
    );
  });

  it("should be smaller than preset-env targets.esmodules in loose mode", async () => {
    const out = await compareFixturesToPresetEnv(
      path.join(__dirname, "browser/fixtures"),
      {
        compile: ({ file }) => babel(file, { presets: [preset] }),
        compileEnv: ({ file }) =>
          babel(file, {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: { esmodules: true },
                  loose: true,
                },
              ],
            ],
          }),
        assertion: ({ size, sizeEnv }) => expect(size).toBeLessThan(sizeEnv),
      }
    );
    console.log(
      chalk.blueBright(
        `Compared to @babel/preset-env's targets.esmodules ${chalk.bold`loose`} output:`
      ) + out
    );
  });
});
