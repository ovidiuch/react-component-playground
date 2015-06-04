var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Render Children`, function() {
  var _ = require('lodash'),
      $ = require('jquery'),
      loadChild = require('react-component-tree').loadChild,
      render = require('tests/lib/render-component.js'),
      stubLoadChild = require('tests/setup/stub-load-child.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture,
      childParams,
      shouldBeCloned = {};

  // Child components are outside the scope
  stubLoadChild();

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));

    // Generating this state from props is tested separately in lifecycle tests
    component.setState({
      fixtureContents: {
        width: 200,
        height: 100,
        state: {
          paused: true
        },
        nested: {
          obj: shouldBeCloned
        }
      },
      fixtureChange: 155
    });

    childParams = component.children.preview.call(component);
  });

  it('should load preview component', function() {
    expect(loadChild.loadChild).to.have.been.called;
  });

  it('should send component class to preview child', function() {
    expect(childParams.component)
          .to.equal(fixture.components[fixture.component].class);
  });

  it('should send fixture contents to preview child', function() {
    var fixtureContents = component.state.fixtureContents;
    expect(childParams.width).to.equal(fixtureContents.width);
    expect(childParams.height).to.equal(fixtureContents.height);
  });

  it('should not send state as prop to preview child', function() {
    expect(childParams.state).to.be.undefined;
  });

  it('should generate unique key for preview child', function() {
    expect(childParams.key).to.equal(
        fixture.component + '-' +
        fixture.fixture + '-' +
        component.state.fixtureChange);
  });

  it('should clone fixture contents sent to child', function() {
    expect(childParams.nested.obj).to.deep.equal(shouldBeCloned);
    expect(childParams.nested.obj).to.not.equal(shouldBeCloned);
  });
});
