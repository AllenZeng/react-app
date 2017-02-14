const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ChunkLoadingPlugin = require('./ChunkLoadingPlugin');

const filePath = {
  src: path.join(__dirname, '../src'),
  public: path.join(__dirname, '../public'),
};

module.exports = {
  context: filePath.src,
  externals: {
    echarts: 'echarts',
    fabric: 'fabric',
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'pic.[hash:8].bundle.css' }),
    new HtmlWebpackPlugin({
      inject: true,
      template: process.env.NODE_ENV === 'production' ? '../src/index_template.html' : '../src/index_template_dev.html',
    }),
    // new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      test: /jpeg-web-worker\.js/,
      options: {
        worker: { output: { filename: '[hash:8].worker.js' } },
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: '[hash:8].common.js',
      children: true,
      async: true,
    }),
    new ChunkLoadingPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ttf|eot|svg|woff)$/,
        use: [{
          loader: 'file-loader',
          query: {
            name: 'fonts/[name].[ext]',
          },
        }],
        include: [filePath.public],
        exclude: ['node_modules', filePath.src],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader!postcss-loader',
        }),
        include: [filePath.public, filePath.src],
        exclude: ['node_modules'],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [filePath.src],
        exclude: ['node_modules'],
      },
    ],
  },
  resolve: {
    modules: [filePath.src, filePath.public, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {},
  },
};
