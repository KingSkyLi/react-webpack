const path = require('path');
const baseConfig = require('./webpack.base.js');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(baseConfig, {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/serverEntry.js')
  },
  output: {
    filename: 'serverEntry.js',
    libraryTarget: 'commonjs2'
  }
})
