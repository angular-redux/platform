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
      extensions: ["", ".webpack.js", ".ts", ".tsx", ".js", ".jsx"]
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
