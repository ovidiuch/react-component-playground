var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Transitions Props`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('tests/lib/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture,
      stateSet,
      stateInjected;

  beforeEach(function() {
    ({container, component, $component} = render(fixture));

    sinon.stub(ComponentTree, 'injectState');
    sinon.spy(component, 'setState');

    // TODO: Replace with new render call. Problem is instance changes from one
    // render to another
    component.setProps({
      component: 'SecondComponent',
      fixture: 'index'
    });

    stateSet = component.setState.lastCall.args[0];
    stateInjected = ComponentTree.injectState.lastCall.args;
  });

  afterEach(function() {
    ComponentTree.injectState.restore();
    component.setState.restore();
  });

  it('should replace fixture contents', function() {
    expect(stateSet.fixtureContents.myProp).to.equal(true);
  });

  it('should reset unserializable fixture props', function() {
    expect(stateSet.fixtureUnserializableProps).to.deep.equal({});
  });

  it('should replace fixture user input', function() {
    expect(JSON.parse(stateSet.fixtureUserInput).myProp).to.equal(true);
  });

  it('should reset valid user input flag', function() {
    expect(stateSet.isFixtureUserInputValid).to.be.true;
  });

  it('should inject new state to preview child', function() {
    expect(stateInjected[0]).to.equal(component.refs.preview);
    expect(stateInjected[1].somethingHappened).to.equal(true);
  });
});
