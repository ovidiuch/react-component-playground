var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Transitions Mount`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  // The following tests are about the initial state generation, so we don't
  // want it included in the fixture
  var statelessFixture = _.omit(originalFixture, 'state');

  beforeEach(function() {
    sinon.stub(ComponentTree, 'injectState');

    ({fixture, container, component, $component} = render(statelessFixture));
  });

  afterEach(function() {
    ComponentTree.injectState.restore();
  });

  it('should expand component of selected fixture', function() {
    var expandedComponents = component.state.expandedComponents;

    expect(expandedComponents.length).to.equal(1);
    expect(expandedComponents[0]).to.equal('FirstComponent');
  });

  it('should populate state with fixture contents', function() {
    expect(component.state.fixtureContents.myProp).to.equal(false);
  });

  it('should populate stringified fixture contents as user input', function() {
    expect(component.state.fixtureUserInput).to.equal(
        JSON.stringify(component.state.fixtureContents, null, 2));
  });

  it('should inject state to preview child', function() {
    var args = ComponentTree.injectState.lastCall.args;
    expect(args[0]).to.equal(component.refs.preview);
    expect(args[1].somethingHappened).to.equal(false);
  });
});
