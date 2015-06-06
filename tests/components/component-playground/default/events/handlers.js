var FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));

    sinon.spy(component, 'setState');
  });

  afterEach(function() {
    component.setState.restore();
  });

  it('should ignore fixture update', function() {
    component.onFixtureUpdate();

    expect(component.setState).to.not.have.been.called;
  });
});
