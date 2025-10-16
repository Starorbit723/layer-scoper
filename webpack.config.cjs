const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  entry: {
    react: [
      'webpack-hot-middleware/client?reload=true&timeout=20000',
      path.resolve(__dirname, 'src/pages/react/main.js')
    ],
    preact: [
      'webpack-hot-middleware/client?reload=true&timeout=20000',
      path.resolve(__dirname, 'src/pages/preact/main.js')
    ],
    vue2: [
      'webpack-hot-middleware/client?reload=true&timeout=20000',
      path.resolve(__dirname, 'src/pages/vue2/main.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].bundle.js',
    publicPath: '/'
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      { test: /\.less$/i, use: ['style-loader', 'css-loader', 'less-loader'] },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][hash][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'react/index.html',
      template: path.resolve(__dirname, 'src/pages/react/index.html'),
      chunks: ['react'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      filename: 'preact/index.html',
      template: path.resolve(__dirname, 'src/pages/preact/index.html'),
      chunks: ['preact'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      filename: 'vue2/index.html',
      template: path.resolve(__dirname, 'src/pages/vue2/index.html'),
      chunks: ['vue2'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/pages/index.html'),
      chunks: [],
      inject: false
    })
  ]
};


