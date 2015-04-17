var ComponentTree = require('react-component-tree'),
    ComponentPlayground =
        require('../../../src/components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var component,
      params,
      childParams;

  function render(extraParams) {
    // Alow tests to extend fixture before rendering
    _.merge(params, extraParams);

    component = ComponentTree.render({
      component: ComponentPlayground,
      snapshot: params,
      container: document.createElement('div')
    });

    if (params.selectedComponent) {
      childParams = component.children.preview.call(component);
    }
  }

  beforeEach(function() {
    // Don't render any children
    sinon.stub(ComponentTree.loadChild, 'loadChild');

    params = {
      components: {
        FirstComponent: {
          class: 'FirstComponent',
          fixtures: {
            'default state': {}
          }
        }
      },
      router: {
        routeLink: sinon.spy()
      }
    };
  });

  afterEach(function() {
    ComponentTree.loadChild.loadChild.restore();
  })

  describe('children', function() {
    it('should not render child without selected fixture', function() {
      render();

      expect(ComponentTree.loadChild.loadChild).to.not.have.been.called;
    });

    it('should render child with selected fixture', function() {
      render({
        selectedComponent: 'FirstComponent',
        selectedFixture: 'default state'
      });

      expect(ComponentTree.loadChild.loadChild).to.have.been.called;
    });

    describe('with fixture contents', function() {
      beforeEach(function() {
        _.assign(params, {
          selectedComponent: 'FirstComponent',
          // Children draw their props from state.fixtureContents. Generating
          // state from props is tested in the state.js suite
          state: {
            fixtureContents: {
              width: 200,
              height: 100,
              state: {
                paused: true
              }
            }
          }
        });
      });

      it('should send component class to preview child', function() {
        render();

        expect(childParams.component)
              .to.equal(params.components['FirstComponent'].class);
      });

      it('should send fixture contents to preview child', function() {
        render();

        var fixtureContents = component.state.fixtureContents;
        expect(childParams.width).to.equal(fixtureContents.width);
        expect(childParams.height).to.equal(fixtureContents.height);
      });

      it('should not send state as prop to preview child', function() {
        render();

        var fixtureContents = component.state.fixtureContents;
        expect(childParams.state).to.be.undefined;
      });

      it('should use fixture contents as key for preview child', function() {
        render();

        var fixtureContents = component.state.fixtureContents,
            stringifiedFixtureContents = JSON.stringify(fixtureContents);

        expect(childParams.key).to.equal(stringifiedFixtureContents);
      });

      it('should clone fixture contents sent to child', function() {
        var obj = {};

        params.state.fixtureContents.nested = {
          shouldBeCloned: obj
        };

        render();

        expect(childParams.nested.shouldBeCloned).to.not.equal(obj);
      });
    });
  });
});
