import { transform } from "@babel/core";
import preset from "../..";

const CONFIG = {
  babelrc: false,
  configFile: false,
  sourceMap: false,
  compact: true,
  presets: [preset],
};

function babel(code) {
  return transform(code, CONFIG).code;
}

// https://bugs.webkit.org/show_bug.cgi?id=176685
describe("Safari await negation", () => {
  it("should ignore non-affected statements", () => {
    expect(babel(`async()=>await 1;`, CONFIG)).toEqual(`async()=>await 1;`);
  });

  it("should wrap negated await statements in parens", () => {
    expect(babel(`async()=>!await 1;`, CONFIG)).toEqual(`async()=>!(await 1);`);
  });
});
