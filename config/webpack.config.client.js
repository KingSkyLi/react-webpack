const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
// 引入webpack，并使用webpack.HotModuleReplacementPlugin 插件
const webpack = require('webpack');
const baseConfig = require('./webpack.base.js');
const webpackMerge = require('webpack-merge');

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
})
if (isDev) {
  // 微热更新重新配置入口
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.devServer = {
    host: '0.0.0.0',
    port: '8086',
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: '/public',
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api':'http://localhost:3333'
    }
  };
  // 使用webpack插件
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}


module.exports = config;
