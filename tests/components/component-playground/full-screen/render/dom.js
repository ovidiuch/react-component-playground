var FIXTURE = 'full-screen';

describe(`ComponentPlayground (${FIXTURE}) Render DOM`, function() {
  var _ = require('lodash'),
      $ = require('jquery'),
      render = require('tests/lib/render-component.js'),
      stubLoadChild = require('tests/setup/stub-load-child.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  // Child components are outside the scope
  stubLoadChild();

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  it('should add full-screen class', function() {
    expect($component.hasClass('full-screen')).to.equal(true);
  });
});
