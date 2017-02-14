const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

const config = require('../src/env_config');
const commonConfig = require('./webpack.base.js');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-eval-source-map',
  devServer: {
    port: config.port,
    hot: true,
    host: config.domain,
    historyApiFallback: true,
    noInfo: false,
    stats: 'minimal',
    publicPath: '/',
    compress: true,
    // https: true,
  },
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    './index',
  ],
  output: {
    path: '/',
    publicPath: '/',
    filename: 'pic.[hash:8].bundle.js',
    chunkFilename: '[id].[hash:8].chunk..js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({ url: `http://${config.domain}:${config.port}` }),
  ],
});
