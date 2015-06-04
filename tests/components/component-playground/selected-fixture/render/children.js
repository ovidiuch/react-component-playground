var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Render Children`, function() {
  var loadChild = require('react-component-tree').loadChild,
      render = require('tests/lib/render-component.js'),
      stubLoadChild = require('tests/setup/stub-load-child.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture,
      childParams;

  stubLoadChild();

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));

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
    var fixtureContents = fixture.state.fixtureContents;
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
    expect(childParams.nested.shouldBeCloned).to.deep.equal(
        fixture.state.fixtureContents.nested.shouldBeCloned);
    expect(childParams.nested.shouldBeCloned).to.not.equal(
        fixture.state.fixtureContents.nested.shouldBeCloned);
  });
});
