/* eslint-disable no-var */
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

var webpackConfig =  {
  development: {
    entry: [
      'webpack-dev-server/client?http://localhost:5000',
      'webpack/hot/dev-server',
      './js/app'
    ],
    output: {
      path: __dirname,
      filename: 'bundle.js',
      publicPath: '/static/'
    },
    resolve: {
      extensions: ['', '.js']
    },
    devtool: 'eval-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['babel'],
          include: path.join(__dirname, 'js')
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader!postcss-loader'
        },
        { test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/, loader: 'url?limit=10000' },
        { test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/, loader: 'file' }
      ]
    },
    postcss: function () {
      return [autoprefixer];
    }
  },
  production: {
    entry: './js/app',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['', '.js']
    },
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['babel'],
          include: path.join(__dirname, 'js')
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader!postcss-loader'
        },
        { test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/, loader: 'url?limit=10000' },
        { test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/, loader: 'file' }
      ]
    },
    postcss: function () {
      return [autoprefixer];
    }
  }

};
var env = process.env.NODE_ENV || "development";
module.exports = webpackConfig[env];
