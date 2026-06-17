import { declare } from "@babel/helper-plugin-utils";

/**
 * @babel/preset-modules produces clean, minimal output for ES Modules-supporting browsers.
 * @param {Object} [options]
 * @param {boolean} [options.loose=false] Loose mode skips seldom-needed transforms that increase output size.
 */
export default declare((api, opts) => {
  api.assertVersion("^8.0.0");

  const loose = opts.loose === true;

  return {
    plugins: [
      import.meta.resolve("./plugins/transform-edge-default-parameters"),
      import.meta.resolve("./plugins/transform-tagged-template-caching"),
      import.meta.resolve("./plugins/transform-jsx-spread"),
      import.meta.resolve("./plugins/transform-safari-for-shadowing"),
      import.meta.resolve("./plugins/transform-safari-block-shadowing"),
      import.meta.resolve("./plugins/transform-async-arrows-in-class"),
      !loose && import.meta.resolve("./plugins/transform-edge-function-name"),
      import.meta.resolve("@babel/plugin-transform-unicode-property-regex"),
      import.meta.resolve("@babel/plugin-transform-dotall-regex"),
    ].filter(Boolean),
  };
});
