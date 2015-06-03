module.exports = {
  components: {
    FirstComponent: {
      class: 'FirstComponent',
      fixtures: {
        'default': {},
        'error': {},
        'simple': {}
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
    routeLink: function() {}
  }
};
