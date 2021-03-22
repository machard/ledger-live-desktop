const path = require("path");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const babelPlugins = require("./babel.plugins");
const fs = require("fs");

const injections = fs.readdirSync("./src/ll-client/injections");

const babelConfig = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          electron: "7.1.9",
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-flow",
  ],
  plugins: [
    ...babelPlugins,
    [
      "babel-plugin-styled-components",
      {
        ssr: false,
      },
    ],
  ],
};

module.exports = {
  target: "electron-preload",
  entry: {
    ...injections.reduce(
      (acc, injection) => ({
        ...acc,
        [injection]: `./src/ll-client/injections/${injection}/index.js`,
      }),
      {},
    ),
  },
  output: {
    path: path.resolve(__dirname, ".webpack"),
    filename: "[name]/bundle.js",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(__dirname, ".webpack", "cacheProvider"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: babelConfig,
      },
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
};
