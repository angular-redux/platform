'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = [
  new HtmlWebpackPlugin({
    template: './source/index.html',
    inject: 'body',
    minify: false,
  }),
  new webpack.NoErrorsPlugin(),
  new webpack.SourceMapDevToolPlugin({ filename: null, test: /\.ts$/ }),
];
