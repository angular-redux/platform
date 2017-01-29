'use strict';

exports.css = {
  test: /\.css$/,
  loader: 'raw-loader',
};

exports.ts = {
  test: /\.ts$/,
  loader: '@ngtools/webpack',
  exclude: /node_modules/,
};

exports.js = {
  test: /\.js$/,
  loader: 'babel-loader',
  query: {
    compact: false,
  },
  include: /(angular|rxjs)/,
};

exports.istanbulInstrumenter = {
  enforce: 'post',
  test: /^(.(?!\.test))*\.ts$/,
  loader: 'istanbul-instrumenter-loader',
};

exports.html = {
  test: /\.html$/,
  loader: 'raw-loader',
};

