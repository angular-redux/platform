'use strict';

const webpack = require('webpack');

const base = [
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    __PRODUCTION__: JSON.stringify(process.env.NODE_ENV === 'production'),
    __TEST__: JSON.stringify(process.env.TEST || false),
  }),
  new webpack.NoErrorsPlugin(),
  new webpack.IgnorePlugin(/angular/),
  new webpack.IgnorePlugin(/rxjs/),
];

const development = [
  new webpack.SourceMapDevToolPlugin({ filename: null, test: /\.ts$/ })
];

const production = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
];

module.exports = base
  .concat(process.env.NODE_ENV === 'production' ? production : [])
  .concat(process.env.NODE_ENV === 'development' ? development : []);
