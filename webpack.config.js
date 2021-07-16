// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require('webpack-node-externals');
const { VueLoaderPlugin } = require("vue-loader");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const babelConfig = {
  cacheDirectory: true,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'not ie 11'],
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: []
};



/** @type {import('webpack').Configuration} */
const config = {
  mode: 'development',
  entry: "./src/index.ts",
  output: {
    libraryTarget: 'commonjs2',
    filename: 'index.js',
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/]
            }
          },
        ],
        include: path.resolve(__dirname, 'src'),
      },
     /* {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
      },*/
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        options: babelConfig,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          isServerBuild: false
        }
      }
    ],
  },
  resolve: {
    alias: {
      vue: "@vue/runtime-dom"
    },
    extensions: [".tsx", ".ts", ".js", ".vue"],
    // fallback: { "assert": false }
  },
  target: 'node',
  externals: [nodeExternals()]
};

module.exports = () => {
  return config;
};
