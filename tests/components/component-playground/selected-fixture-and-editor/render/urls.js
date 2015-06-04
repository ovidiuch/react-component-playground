var FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Render URLs`, function() {
  var _ = require('lodash'),
      $ = require('jquery'),
      render = require('tests/lib/render-component.js'),
      getUrlProps = require('tests/lib/get-url-props.js'),
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

  it('should generate close fixture editor url', function() {
    var urlProps = getUrlProps(component.refs.editorButton);

    // The editor prop is undefined because default values are ignored
    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture
    });
  });

  it('should include editor prop in fixture url', function() {
    var firstFixtureButton = component.refs.FirstComponentdefaultButton,
        urlProps = getUrlProps(firstFixtureButton);

    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture,
      editor: true
    });
  });

  it('should not include editor prop in full-screen url', function() {
    var urlProps = getUrlProps(component.refs.fullScreenButton);

    expect(urlProps.editor).to.equal(undefined);
  });
});
