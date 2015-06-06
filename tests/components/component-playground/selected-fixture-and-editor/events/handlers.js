var FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  var childSnapshot = {},
      stringifiedChildSnapshot = '{}',
      stateSet;

  beforeEach(function() {
    sinon.stub(ComponentTree, 'serialize').returns(childSnapshot);
    sinon.stub(JSON, 'stringify').returns(stringifiedChildSnapshot);

    ({fixture, container, component, $component} = render(originalFixture));

    sinon.spy(component, 'setState');

    component.onFixtureUpdate();
    stateSet = component.setState.lastCall.args[0];
  });

  afterEach(function() {
    ComponentTree.serialize.restore();
    JSON.stringify.restore();

    component.setState.restore();
  });

  it('should mark user input state as valid', function() {
    expect(stateSet.isFixtureUserInputValid).to.equal(true);
  });

  it('should serialize preview child', function() {
    expect(ComponentTree.serialize)
          .to.have.been.calledWith(component.refs.preview);
  });

  it('should update child snapshot state', function() {
    expect(stateSet.fixtureContents).to.equal(childSnapshot);
  });

  it('should stringify preview child snapshot', function() {
    expect(JSON.stringify).to.have.been.calledWith(childSnapshot);
  });

  it('should update stringified child snapshot state', function() {
    expect(stateSet.fixtureUserInput).to.equal(stringifiedChildSnapshot);
  });
});
