var _ = require('lodash'),
    $ = require('jquery'),
    loadChild = require('react-component-tree').loadChild,
    render = require('tests/lib/render-component.js'),
    stubLoadChild = require('tests/setup/stub-load-child.js'),
    originalFixture = require('../fixture.js');

describe('ComponentPlayground (default)', function() {
  var component,
      $component,
      container,
      fixture;

  // Child components are outside the scope
  stubLoadChild();

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  describe('Render (children)', function() {
    it('should not load preview component', function() {
      expect(loadChild.loadChild).to.not.have.been.called;
    });
  });
});
