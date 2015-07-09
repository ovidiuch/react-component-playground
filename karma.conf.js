var path = require('path');

module.exports = function(config) {
  config.set({
    basePath: 'tests/',
    browsers: ['PhantomJS'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    files: [
      'bind-polyfill.js',
      'components/**/*.js'
    ],
    frameworks: ['mocha', 'chai', 'sinon-chai'],
    preprocessors: {
      '**/*.js': ['webpack']
    },
    reporters: ['mocha', 'coverage'],
    webpack: {
      resolve: {
        alias: {
          components: path.join(__dirname, 'src/components'),
          fixtures: path.join(__dirname, 'fixtures'),
          tests: path.join(__dirname, 'tests')
        }
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }, {
          test: /\.less$/,
          loader: 'style-loader!css-loader?modules&importLoaders=1' +
              '&localIdentName=[name]__[local]___[hash:base64:5]' +
              '!less-loader'
        }],
        postLoaders: [{
          test: /\.jsx?$/,
          exclude: /(node_modules|tests)\//,
          loader: 'istanbul-instrumenter'
        }]
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
