import { transform } from "@babel/core";
import taggedTemplates from "../lib/plugins/transform-tagged-template-caching";

const CONFIG = {
  babelrc: false,
  configFile: false,
  sourceMap: false,
  plugins: [taggedTemplates],
};

function babel(code) {
  return transform(code, CONFIG).code;
}

describe("@babel/preset-modern transform-tagged-template-caching evaluation", () => {
  it("should pass same strings reference on repeated calls", () => {
    const f = eval(babel("(function f(){return Object`a`;})"));
    expect(f()).toStrictEqual(f());
    expect(f()).toStrictEqual(new f());
    expect(f()).toStrictEqual(f.call({}));
  });

  it("should pass different strings references for different callsites", () => {
    const f = eval(babel("(function f(){return Object`a`===Object`b`;})"));
    expect(f()).toEqual(false);
  });

  it("should pass different strings references for different callsites with same quasis", () => {
    const f = eval(babel("(function f(){return Object`a`===Object`a`;})"));
    expect(f()).toEqual(false);
  });
});
