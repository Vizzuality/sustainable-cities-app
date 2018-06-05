const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const sharedConfig = require('./shared.js');

const rootPath = process.cwd();

module.exports = merge(sharedConfig, {

  output: {
    path: path.join(rootPath, 'dist/backoffice/'),
    filename: '[name]-[hash].js',
    publicPath: '/'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]

});
