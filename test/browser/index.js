import asyncArrows from "fixture!./fixtures/async-arrows";
import awaitNegation from "fixture!./fixtures/await-negation";
import functionName from "fixture!./fixtures/function-name";
import defaultParams from "fixture!./fixtures/default-params";
import defaultParamsArrow from "fixture!./fixtures/default-params-arrow";

/* eslint-disable no-unused-vars */

const cjs = code =>
  `var module={},exports=module.exports={},require=function(){};\n${code}\nmodule.exports`;

function run(code, exportName = "default") {
  let exports;
  expect(() => {
    exports = eval(cjs(code));
  }).not.toThrow();
  expect(Object.keys(exports)).toContain(exportName);
  return exports[exportName];
}

describe("Tagged Templates", () => {
  it("should cache template strings", () => {
    const myTag = s => s;

    function a() {
      return myTag`a`;
    }

    function b() {
      return myTag`a`;
    }

    // Also make sure the transform got applied.
    expect(Function.prototype.toString.call(a)).not.toMatch(/myTag`/);

    expect(a()).toBe(a());
    expect(a()).toBe(new a());
    expect(b()).toBe(new b());
    expect(a()).not.toBe(b());
  });
});

describe("class arrows", () => {
  it("should allow async arrows in classes", async () => {
    const X = run(asyncArrows);
    expect(typeof X).toBe("function");
    let x, fn, a;
    expect(() => {
      x = new X();
      fn = x.a();
      a = fn();
    }).not.toThrow();
    expect(await a).toBe(x.a);
  });
});

describe("await negation", () => {
  it("should be wrapped in parens", async () => {
    expect(awaitNegation).toMatch(/!\(await/);
  });

  it("should execute successfully", async () => {
    const x = run(awaitNegation);
    expect(typeof x).toBe("function");

    let p;
    expect(() => {
      p = x();
    }).not.toThrow();

    expect(await p).toBe(false);
  });
});

describe("default-params", () => {
  it("should support default destructured parameters in functions", async () => {
    const foo = run(defaultParams, "foo");
    expect(typeof foo).toBe("function");

    let p;
    expect(() => {
      p = foo(undefined, {}, {});
    }).not.toThrow();
    expect(p).toEqual([1, 2, 3]);

    expect(() => {
      p = foo(4, { b: 5 }, { c: 6 });
    }).not.toThrow();
    expect(p).toEqual([4, 5, 6]);
  });

  it("should support default destructured parameters in arrow functions", async () => {
    const foo = run(defaultParamsArrow, "foo");
    expect(typeof foo).toBe("function");

    let p;
    expect(() => {
      p = foo(undefined, {}, {});
    }).not.toThrow();
    expect(p).toEqual([1, 2, 3]);

    expect(() => {
      p = foo(4, { b: 5 }, { c: 6 });
    }).not.toThrow();
    expect(p).toEqual([4, 5, 6]);
  });
});

describe("function-name", () => {
  let test;
  it("should execute", async () => {
    test = run(functionName);
  });
  it("should infer .name for function expressions in variable declarations", async () => {
    const [expression] = test;
    expect(typeof expression).toBe("function");
    expect(expression.name).toBe("foo");
  });
  it("should infer .name for arrow functions in variable declarations", async () => {
    const [, arrow] = test;
    expect(typeof arrow).toBe("function");
    expect(arrow.name).toBe("bar");
  });
});
