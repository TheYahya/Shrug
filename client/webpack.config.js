const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
  const isDevMode = argv.mode === 'development';
  return {
    entry: './src/App.jsx',
    output: {
      path: path.join(__dirname, 'public', 'dist'),
      publicPath: '/dist',
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
      },{
        test: /\.(sa|sc|c)ss$/,
        use: [
          isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ]}, 
      ]
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
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
      new CleanWebpackPlugin(),
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
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, 'public'),
      },
      hot: true,
      open: true
    }
  };
};
