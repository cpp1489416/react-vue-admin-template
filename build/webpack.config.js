/* eslint-disable */
const HtmlWebPackPlugin = require("html-webpack-plugin")
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const utils = require('./utils')
const merge = require('webpack-merge')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

let config = {
  entry: ['./src/index.js'],
  module: {
    rules: [　
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { 
                minimize: true 
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(glsl|txt)$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      assetsPublicPath: '/',
      assetsSubDirectory: 'static'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{ 
        from: 'public', 
        to: 'public'
    }])
  ],
  resolve: {
    extensions: ['*', '.js', '.vue', '.ts', '.tsx'],
    alias:{
      '@': resolve('src')
    }
  },
  devServer: {
    contentBase: require('path').join(__dirname, "dist"),
    compress: true,
    port: 9528,
    host: "127.0.0.1",
  }
};

config = merge(
  config,
  {
    module: {
      rules: utils.styleLoaders({
        sourceMap: false,
        usePostCSS: true
      })
    }
  }
)

module.exports = config