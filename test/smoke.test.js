import presetModern from "../lib/index.js";

describe("@babel/preset-modern", () => {
  describe("smoke test", () => {
    it("should assert Babel 8", () => {
      expect(presetModern).toEqual(expect.any(Function));
      const assertVersion = jest.fn();
      presetModern(
        {
          assertVersion,
        },
        {}
      );
      expect(assertVersion).toHaveBeenCalledWith("^8.0.0");
    });

    it("should return a configuration object with plugins", () => {
      expect(presetModern).toEqual(expect.any(Function));
      const preset = presetModern(
        {
          assertVersion() {},
        },
        {}
      );
      expect(preset).toHaveProperty("plugins");
      expect(preset.plugins).toEqual(expect.any(Array));
    });
  });
});
