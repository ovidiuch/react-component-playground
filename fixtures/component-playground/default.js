module.exports = {
  components: {
    FirstComponent: {
      class: 'FirstComponent',
      fixtures: {
        'default': {
          nestedProp: {
            foo: 'bar'
          }
        },
        'error': {}
      }
    },
    SecondComponent: {
      class: 'SecondComponent',
      fixtures: {
        'index': {}
      }
    }
  },
  router: {
    routeLink: function() {},
    goTo: function() {}
  }
};
