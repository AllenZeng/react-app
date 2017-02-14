const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.base.js');

module.exports = webpackMerge(commonConfig, {
  entry: [
    'babel-polyfill',
    './index',
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  output: {
    path: 'dist',
    publicPath: 'dist',
    filename: 'pic.[hash:8].bundle.js',
    chunkFilename: '[id].[hash:8].chunk..js',
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: false,
    //   mangle: {
    //     screw_ie8: true,
    //     keep_fnames: true,
    //   },
    //   compress: {
    //     screw_ie8: true,
    //   },
    //   comments: false,
    // }),
  ],
});
