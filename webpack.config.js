var path = require('path');

module.exports = {
  entry: './src/components/component-playground.jsx',
  externals: {
    'lodash': 'lodash',
    'react': 'react'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }]
  },
  output: {
    libraryTarget: 'umd',
    library: 'ComponentPlayground',
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  }
};
