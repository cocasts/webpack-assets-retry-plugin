import * as path from 'path';
import type { Configuration } from 'webpack';
import { AssetsRetryPlugin } from '../../src';
import HtmlWebpackPlugin = require('html-webpack-plugin');
import MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devtool: false,
  entry: path.join(__dirname, '..', 'integration', 'fixtures', 'index.ts'),
  output: {
    path: path.join(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin(),
    new AssetsRetryPlugin({
      maxRetryCount: 3,
      domain: ['localhost:3000/', 'localhost:3000/fallback/'],
    }),
  ],
  optimization: {
    chunkIds: 'named',
    runtimeChunk: true,
    minimize: true,
  },
  resolve: { extensions: ['.ts'] },
} as Configuration;
