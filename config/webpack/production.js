const webpack = require('webpack');
const merge = require('webpack-merge');

const sharedConfig = require('./shared.js');

module.exports = merge(sharedConfig, {

  output: { filename: '[name]-[hash].js' },

  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]

});
