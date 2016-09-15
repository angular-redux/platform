var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './vendor.ts',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ["", ".webpack.js", ".ts", ".tsx", ".js", ".jsx"],
    fallback: __dirname + '/../../node_modules',
    root: [
      __dirname + '/../../node_modules',
      'node_modules'
    ],
    alias: {
      'ng2-redux-router$':__dirname + '/../..'
    }
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      { test: /\.ts$/,  loader: 'awesome-typescript-loader', exclude: '/node_modules/' },
    ]
  }
};
