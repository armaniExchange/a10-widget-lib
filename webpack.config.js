const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: [
    './src/index'
  ],

  output: {
    path: __dirname + '/dist',
    filename: 'main.js',
    umdNamedDefine: true,
    library: 'a10-widget-lib',
    libraryTarget: 'umd'
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!sass-loader' })
      },
      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' })
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(js|jsx)$/,
        // include: path.join(__dirname, CONTENT_BASE),
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: true
            }
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(gif|png|jpg|jpeg|ttf|eot|svg?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx' ],
    modules: [
      'node_modules'
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
    }),

    new webpack.ProvidePlugin({
      Promise: 'es6-promise-promise', // works as expected
    }),

    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true
    }),
    new ExtractTextPlugin({ filename: 'style.css',  allChunks: true }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    })
  ],
  // devtool:'source-map'
};

