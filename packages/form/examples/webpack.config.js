'use strict';

const path = require('path');

const loaders = require('../webpack/loaders');

module.exports = {
  entry: './source/index.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js',
    library: 'main',
    libraryTarget: undefined,
  },

  devtool: process.env.NODE_ENV === 'production' ?
    'source-map' :
    'inline-source-map',

  resolve: {
    extensions: [
      '.webpack.js',
      '.web.js',
      '.ts',
      '.js',
    ],
  },

  plugins: require('./webpack/plugins'),

  module: {
    loaders: [
      loaders.css,
      //loaders.js,
      loaders.ts,
      loaders.html,
    ],
    noParse: [
      /zone\.js\/dist\/.+/,
      /angular2\/bundles\/.+/,
    ],
  },
};
