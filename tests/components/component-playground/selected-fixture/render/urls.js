var _ = require('lodash'),
    $ = require('jquery'),
    render = require('tests/lib/render-component.js'),
    getUrlProps = require('tests/lib/get-url-props.js'),
    stubLoadChild = require('tests/setup/stub-load-child.js'),
    originalFixture = require('../fixture.js');

describe('ComponentPlayground (selected fixture)', function() {
  var component,
      $component,
      container,
      fixture;

  // Child components are outside the scope
  stubLoadChild();

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  describe('Render (URLs)', function() {
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
});
