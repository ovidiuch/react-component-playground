var _ = require('lodash'),
    defaultFixture = require('./default.js');

module.exports = _.merge({}, defaultFixture, {
  component: 'FirstComponent',
  fixture: 'default',
  containerClassName: 'my-app-namespace'
});
