'use strict';

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const {join} = require('path');

const {AotPlugin} = require('@ngtools/webpack');

module.exports = [
  new HtmlWebpackPlugin({
    template: './source/index.html',
    inject: 'body',
    minify: false,
  }),
  new webpack.NoErrorsPlugin(),
  new webpack.SourceMapDevToolPlugin({ filename: null, test: /\.ts$/ }),
  new webpack.ContextReplacementPlugin(
    /angular(\/|\\)core(\/|\\)(esm(\/|\\)src|src)(\/|\\)linker/, __dirname),
  new AotPlugin({
    tsConfigPath: './tsconfig.json',
    entryModule: './module#ExampleModule',
    skipCodeGeneration: true,
  }),
];
