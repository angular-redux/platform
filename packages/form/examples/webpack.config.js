const path = require('path');

const config = require('../webpack.config');

const clone = (original, replace) => Object.assign({}, original, replace);

module.exports =
  clone(config, {
    output: clone(config.output, {
      libraryTarget: undefined,
      path: path.resolve(__dirname, 'dist'),
    }),
    externals: null,
    plugins: require('./webpack/plugins'),
  });
