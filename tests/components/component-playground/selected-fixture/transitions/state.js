var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Transitions State`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture,
      stateInjected;

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));

    sinon.stub(ComponentTree, 'injectState');

    component.setState({
      fixtureChange: fixture.state.fixtureChange + 1
    });

    stateInjected = ComponentTree.injectState.lastCall.args;
  });

  afterEach(function() {
    ComponentTree.injectState.restore();
  });

  it('should inject preview state when fixture changes', function() {
    expect(stateInjected[0]).to.equal(component.refs.preview);
    expect(stateInjected[1].somethingHappened).to.equal(false);
  });
});
