var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Render URLs`, function() {
  var render = require('tests/lib/render-component.js'),
      getUrlProps = require('tests/lib/get-url-props.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  it('should generate open full-screen url', function() {
    var urlProps = getUrlProps(component.refs.fullScreenButton);

    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture,
      fullScreen: true
    });
  });

  it('should generate open fixture editor url', function() {
    var urlProps = getUrlProps(component.refs.editorButton);

    expect(urlProps).to.deep.equal({
      component: fixture.component,
      fixture: fixture.fixture,
      editor: true
    });
  });
});
