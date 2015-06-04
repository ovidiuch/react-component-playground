var FIXTURE = 'full-screen';

describe(`ComponentPlayground (${FIXTURE}) Render DOM`, function() {
  var render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  it('should add full-screen class', function() {
    expect($component.hasClass('full-screen')).to.equal(true);
  });
});
