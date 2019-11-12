module.exports = {
  optimization: {
    minimize: false,
  },
  resolveLoader: {
    alias: {
      fixture: require.resolve("./fixture-loader"),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: /\/fixtures\//,
        loader: "babel-loader",
        options: {
          babelrc: false,
          presets: [require.resolve("../..")],
          plugins: [
            ["@babel/plugin-transform-modules-commonjs", { loose: true }],
          ],
        },
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /\/fixtures\//,
        options: {
          babelrc: false,
          sourceMap: false,
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  esmodules: true,
                },
                loose: true,
              },
            ],
          ],
        },
      },
    ],
  },
};
