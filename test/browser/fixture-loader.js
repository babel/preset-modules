const terser = require("terser");

module.exports = function(code) {
  code = terser.minify(code, {
    compress: true,
    mangle: false,
    // everyone should enable this option:
    safari10: true,
    // most folks don't need this one:
    keep_fnames: true,
  }).code;
  return "export default " + JSON.stringify(code);
};
