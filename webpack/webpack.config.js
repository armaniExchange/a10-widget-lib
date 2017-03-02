const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var base = require('./base');

base.entry = {
  js: [
    './src/index.js'
  ]
};

base.output = {
  path: path.join(__dirname, '../dist'),
  filename: 'main.js',
  publicPath: '/'
};

base.externals = {
  'react': 'react',
  'react-dom': 'react-dom'
};

base.module.loaders =  base.module.loaders.concat([
  {
    test: /\.(html|ejs)$/,
    loader: 'file-loader',
    query: {
      name: '[name].[ext]'
    }
  },
  {
    test: /\.md/,
    loaders: [ 'html-loader', 'markdown-loader' ]
  }

]);

base.plugins = base.plugins.concat([
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
]);

// console.log(base);
module.exports = base;
