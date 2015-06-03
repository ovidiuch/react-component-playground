var _ = require('lodash'),
    $ = require('jquery'),
    render = require('tests/lib/render-component.js'),
    stubLoadChild = require('tests/setup/stub-load-child.js'),
    originalFixture = require('../fixture.js');

describe('ComponentPlayground (full screen)', function() {
  var component,
      $component,
      container,
      fixture;

  // Child components are outside the scope
  stubLoadChild();

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  describe('Render (DOM)', function() {
    it('should add full-screen class', function() {
      expect($component.hasClass('full-screen')).to.equal(true);
    });
  });
});
