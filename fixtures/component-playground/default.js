var React = require('react');

class FirstComponent extends React.Component {
  render() {
    return React.DOM.div();
  }
}

class SecondComponent extends React.Component {
  render() {
    return React.DOM.div();
  }
}

class CustomClass {
  toJSON() {
    return {x: 1, y: 2};
  }
}

module.exports = {
  components: {
    FirstComponent: {
      class: FirstComponent,
      fixtures: {
        'default': {
          myProp: false,
          nested: {
            foo: 'bar',
            shouldBeCloned: {},
            customToJSON: new CustomClass()
          },
          children: [
            React.createElement('span', {
              key: '1',
              children: 'test child',
              customProp: function() {}
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
      class: SecondComponent,
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
