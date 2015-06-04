var _ = require('lodash'),
    defaultFixture = require('./default.js');

module.exports = _.merge({}, defaultFixture, {
  component: 'FirstComponent',
  fixture: 'default',
  containerClassName: 'my-app-namespace',
  state: {
    // Generating this state from props is tested in lifecycle tests
    fixtureContents: {
      width: 200,
      height: 100,
      state: {
        paused: true
      },
      nested: {
        shouldBeCloned: {}
      }
    },
    fixtureChange: 10
  }
});
