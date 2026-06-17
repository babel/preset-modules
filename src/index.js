import { declare } from "@babel/helper-plugin-utils";
import { fileURLToPath } from "url";

// import.meta.resolve returns a file:// URL, but Babel resolves plugins with
// require.resolve when transforming synchronously, which only accepts paths.
const resolve = specifier => fileURLToPath(import.meta.resolve(specifier));

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
      resolve("./plugins/transform-edge-default-parameters/index.js"),
      resolve("./plugins/transform-tagged-template-caching/index.js"),
      resolve("./plugins/transform-jsx-spread/index.js"),
      resolve("./plugins/transform-safari-for-shadowing/index.js"),
      resolve("./plugins/transform-safari-block-shadowing/index.js"),
      resolve("./plugins/transform-async-arrows-in-class/index.js"),
      !loose && resolve("./plugins/transform-edge-function-name/index.js"),
      resolve("@babel/plugin-transform-unicode-property-regex"),
      resolve("@babel/plugin-transform-dotall-regex"),
    ].filter(Boolean),
  };
});
