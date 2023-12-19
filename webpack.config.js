const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const entries = ['content', 'bookmarker-content', 'average-time-content']

/*
  entry: {
    popup: "./popup/popup.js"
  },

  entry: Object.fromEntries(entries.map(entry => [
    entry,
    path.join(__dirname, "./content/", `${entry}.js`)
  ])),
*/

module.exports = {
  entry: Object.fromEntries(entries.map(entry => [
    entry,
    path.join(__dirname, "./content/", `${entry}.js`)
  ])),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', //'[name.js]'
  },
  module: {
    rules: [{ 
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ["@babel/preset-env", "@babel/preset-react"],
            }
        }
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./popup/popup.html",
      filename: "popup.html"
  }),
  new CopyPlugin({
    patterns: [
      { from: "manifest.json" },
      { from: "content" },
      { from: "service-worker.js"}
    ],
  }),
],
};