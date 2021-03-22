const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const babelPlugins = require("./babel.plugins");
const UnusedWebpackPlugin = require("unused-webpack-plugin");
const fs = require("fs");

const apps = fs.readdirSync("./src/ll-client/apps");

const babelConfig = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "10",
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-flow",
  ],
  plugins: [
    ...babelPlugins,
    "react-hot-loader/babel",
    [
      "babel-plugin-styled-components",
      {
        ssr: false,
      },
    ],
  ],
};

module.exports = {
  target: "web",
  node: {
    fs: "empty",
  },
  entry: {
    ...apps.reduce(
      (acc, app) => ({
        ...acc,
        [app]: `./src/ll-client/apps/${app}/src/index.js`,
      }),
      {},
    ),
  },
  output: {
    path: path.resolve(__dirname, ".webpack"),
    filename: "[name]/bundle.js",
  },
  devServer: {
    writeToDisk: true,
  },
  optimization: {
    minimize: false,
  },
  plugins: apps
    .map(
      app =>
        new HtmlWebpackPlugin({
          template: `./src/ll-client/apps/${app}/index.html`, // relative path to the HTML files
          filename: `${app}/index.html`, // output HTML files
          chunks: [app],
        }),
    )
    .concat([
      new HardSourceWebpackPlugin({
        cacheDirectory: path.resolve(__dirname, ".webpack", "cacheRenderer"),
      }),
      new UnusedWebpackPlugin({
        directories: [path.join(__dirname, "src/renderer")],
        exclude: [
          "*.test.js",
          "*.html",
          "bridge/proxy-commands.js",
          "fonts/inter/Inter-Bold.woff2",
          "types.js",
        ],
      }),
    ]),
  module: {
    rules: [
      {
        test: /\.js$/i,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: babelConfig,
      },
      {
        test: /node_modules[\/\\](iconv-lite)[\/\\].+/,
        resolve: {
          aliasFields: ["main"],
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: ["file-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            fallback: require.resolve("file-loader"),
          },
        },
      },
      {
        type: "javascript/auto",
        test: /\.mjs$/,
        use: [],
      },
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
};
