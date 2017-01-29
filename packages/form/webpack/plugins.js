'use strict';

const webpack = require('webpack');

const base = [
  new webpack.NoErrorsPlugin(),
];

const development = [
  new webpack.SourceMapDevToolPlugin({filename: null, test: /\.ts$/})
];

const production = [];

module.exports = base
  .concat(process.env.NODE_ENV === 'production' ? production : [])
  .concat(process.env.NODE_ENV === 'development' ? development : []);
