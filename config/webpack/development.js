const webpack = require('webpack');
const merge = require('webpack-merge');

const sharedConfig = require('./shared.js');

module.exports = merge(sharedConfig, {

  devtool: 'source-map',

  stats: {
    errorDetails: true
  },

  output: {
    pathinfo: true
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ]

});
