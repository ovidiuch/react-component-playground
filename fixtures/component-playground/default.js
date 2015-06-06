var React = require('react');

module.exports = {
  components: {
    FirstComponent: {
      class: 'FirstComponent',
      fixtures: {
        'default': {
          myProp: false,
          nested: {
            foo: 'bar',
            shouldBeCloned: {}
          },
          children: [
            React.createElement('span', {
              children: 'test child'
            })
          ],
          state: {
            somethingHappened: false
          }
        },
        'error': {}
      }
    },
    SecondComponent: {
      class: 'SecondComponent',
      fixtures: {
        'index': {
          myProp: true,
          state: {
            somethingHappened: true
          }
        }
      }
    }
  },
  router: {
    routeLink: function() {},
    goTo: function() {}
  }
};
