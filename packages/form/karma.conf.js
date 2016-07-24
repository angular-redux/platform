'use strict';

process.env.TEST = true;

const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');

module.exports = (config) => {
  const coverage = config.singleRun ? ['coverage'] : [];
  const logLevel = config.singleRun ? config.LOG_INFO : config.LOG_DEBUG;

  config.set({
    frameworks: [
      'jasmine',
      'chai',
    ],

    plugins: [
      'karma-jasmine',
      'karma-chai',
      'karma-sourcemap-writer',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage',
      'karma-remap-istanbul',
      'karma-spec-reporter',
      'karma-chrome-launcher',
    ],

    files: [
      './source/tests.entry.ts',
      {
        pattern: '**/*.map',
        served: true,
        included: false,
        watched: true,
      },
    ],

    preprocessors: {
      './source/tests.entry.ts': [
        'webpack',
        'sourcemap',
      ],
      './source/**/!(*.test|tests.*).(ts|js)': [
        'sourcemap',
      ],
    },

    webpack: {
      plugins,
      entry: './source/tests.entry.ts',
      devtool: 'inline-source-map',
      verbose: false,
      resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
      },
      module: {
        loaders: combinedLoaders(),
        postLoaders: config.singleRun
          ? [ loaders.istanbulInstrumenter ]
          : [ ],
      },
      stats: { colors: true, reasons: true },
      debug: false,
    },

    webpackServer: { noInfo: true },

    reporters: ['spec']
      .concat(coverage)
      .concat(coverage.length > 0 ? ['karma-remap-istanbul'] : []),

    remapIstanbulReporter: {
      src: 'coverage/chrome/coverage-final.json',
      reports: {
        html: 'coverage',
      },
      subdir: b => browser.toLowerCase().split(/[ /-]/)[0]
    },

    coverageReporter: {
      reporters: [
        { type: 'json' },
      ],
      dir: './coverage/',
    },

    logLevel: logLevel, 

    autoWatch: config.singleRun === false,

    browsers: [
      'Chrome',
    ],
  });
};

function combinedLoaders() {
  return Object.keys(loaders).reduce(function reduce(aggregate, k) {
    switch (k) {
    case 'istanbulInstrumenter':
      return aggregate;
    case 'ts':
      return aggregate.concat([ // force inline source maps
        Object.assign(loaders[k],
          { query: { babelOptions: { sourceMaps: 'both' } } })]);
    default:
      return aggregate.concat([loaders[k]]);
    }
  },
  []);
}

