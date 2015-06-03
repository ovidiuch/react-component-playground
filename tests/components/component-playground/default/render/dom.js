var _ = require('lodash'),
    $ = require('jquery'),
    render = require('tests/lib/render-component.js'),
    stubLoadChild = require('tests/setup/stub-load-child.js'),
    originalFixture = require('../fixture.js');

describe('ComponentPlayground (default)', function() {
  var component,
      $component,
      container,
      fixture;

  // Child components are outside the scope
  stubLoadChild();

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  describe('Render (DOM)', function() {
    it('should render cosmos plug', function() {
      expect(component.refs.cosmosPlug).to.exist;
    });

    it('should render component buttons', function() {
      for (var componentName in fixture.components) {
        expect(component.refs[componentName + 'Button']).to.exist;
      }
    });

    it('should render component names', function() {
      for (var componentName in fixture.components) {
        var componentButton = component.refs[componentName + 'Button'];

        expect($(componentButton.getDOMNode()).text()).to.equal(componentName);
      }
    });

    it('should render fixture buttons', function() {
      for (var componentName in fixture.components) {
        var fixtures = fixture.components[componentName].fixtures;

        for (var fixtureName in fixtures) {
          expect(component.refs[componentName + fixtureName + 'Button'])
                .to.exist;
        }
      }
    });

    it('should render fixture names', function() {
      for (var componentName in fixture.components) {
        var componentFixtures = fixture.components[componentName].fixtures;

        for (var fixtureName in componentFixtures) {
          var fixtureButton =
              component.refs[componentName + fixtureName + 'Button'];

          expect($(fixtureButton.getDOMNode()).text()).to.equal(fixtureName);
        }
      }
    });

    it('should not have full-screen class', function() {
      expect($component.hasClass('full-screen')).to.equal(false);
    });

    it('should not render full screen button', function() {
      expect(component.refs.fullScreenButton).to.not.exist;
    });

    it('should not render fixture editor button', function() {
      expect(component.refs.editorButton).to.not.exist;
    });

    it('should not render fixture editor', function() {
      expect(component.refs.editor).to.not.exist;
    });
  });
});
