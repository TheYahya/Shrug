const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const { json } = require('express');

require('dotenv').config({path: '../.env'});

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.development' });
}

module.exports = (env, argv) => {
  const isProduction = env === 'production';
  const CSSExtract = new ExtractTextPlugin('styles.css');
  const isDevMode = argv.mode === 'development';
  return {
    entry: './src/App.jsx',
    output: {
      path: path.join(__dirname, 'public', 'dist'),
      filename: 'bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    module: {
      // loaders: [
      //   { test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/
      //     , loader: 'url?limit=100000&name=[name].[ext]'
      //     }
      // ],
      rules: [{
        loader: 'babel-loader',
        test: /\.(ts|tsx|js|jsx)(\?\S*)?$/,
        exclude: /node_modules/
      }, {
        test: /\.s?css$/,
        use: CSSExtract.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false
              }
            }
          ]
        })
      }]
    },

    // optimization: {
    //   runtimeChunk: 'single',
    //   moduleIds: 'hashed',
    //   splitChunks: {
    //     chunks: 'all',
    //     maxSize: 249856,
    //     cacheGroups: {
    //       commons: {
    //         test: /[\\/]node_modules[\\/]/,
    //         name: 'vendors',
    //         chunks: 'all',
    //         maxSize: 249856,
    //       },
    //     },
    //   },
    // },

    plugins: [
      CSSExtract,
      new CleanWebpackPlugin(),
      // new HtmlWebpackPlugin({
      //   template: path.join(__dirname, 'public', 'index.ejs'),
      //   filename: path.join(__dirname, 'public', 'index.html'),
      // }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          DEFAULT_DOMAIN: JSON.stringify(process.env.DEFAULT_DOMAIN),
          API_BASE_URL: JSON.stringify(process.env.API_BASE_URL),
          GOOGLE_CLIENT_ID: JSON.stringify(process.env.GOOGLE_CLIENT_ID)
        }
      })
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      historyApiFallback: true,
      publicPath: '/dist/',
      hot: true,
      open: true
    }
  };
};
