var React = require('react'),
    _ = require('lodash'),
    defaultFixture = require('./default.js');

module.exports = _.merge({}, defaultFixture, {
  component: 'FirstComponent',
  fixture: 'default',
  containerClassName: 'my-app-namespace',
  state: {
    // Generating this state from props is tested in mounting tests
    fixtureContents: {
      myProp: false,
      nested: {
        foo: 'bar',
        shouldBeCloned: {}
      },
      state: {
        somethingHappened: false
      }
    },
    fixtureUnserializableProps: {
      children: [
        React.createElement('span', {
          children: 'test child'
        })
      ]
    },
    fixtureChange: 10
  }
});
