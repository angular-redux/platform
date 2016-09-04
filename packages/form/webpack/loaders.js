'use strict';

exports.css = {
  test: /\.css$/,
  loader: 'raw',
};

exports.js = {
  test: /\.js$/,
  loader: 'babel',
  query: {
    compact: false,
  },
};

exports.ts = {
  test: /\.ts$/,
  loader: 'awesome-typescript-loader',
};

exports.istanbulInstrumenter = {
  test: /^(.(?!\.test))*\.ts$/,
  loader: 'istanbul-instrumenter-loader',
};

exports.html = {
  test: /\.html$/,
  loader: 'raw',
};
