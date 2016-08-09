'use strict';

const path = require('path');

const loaders = require('./webpack/loaders');

module.exports = {
  entry: './source/index.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js',
    libraryTarget: 'umd',
  },

  devtool: process.env.NODE_ENV === 'production' ?
    'source-map' :
    'inline-source-map',

  resolve: {
    extensions: [
      '',
      '.webpack.js',
      '.web.js',
      '.ts',
      '.js'
    ],
  },

  plugins: require('./webpack/plugins'),

  module: {
    loaders: [
      loaders.css,
      loaders.ts,
      loaders.html,
    ],
    noParse: [
      /zone\.js\/dist\/.+/,
      /angular2\/bundles\/.+/,
      /reflect-metadata/,
    ],
  },

  // We should never include these dependencies in our bundle as the host project
  // will supply its own copies of these packages. The only case where we want to
  // include these dependencies in our bundle is when we are running unit tests.
  externals: [{
    '@angular/common': true,
    '@angular/compiler': true,
    '@angular/core': true,
    '@angular/forms': true,
    'immutable': true,
    'redux': true,
    'reflect-metadata': true,
    'rxjs': true,
    'zone.js': true
  }],
};
