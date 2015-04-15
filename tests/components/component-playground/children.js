var ComponentTree = require('react-component-tree'),
    ComponentPlayground =
        require('../../../src/components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var component,
      props,
      childParams;

  function render(extraProps) {
    // Alow tests to extend fixture before rendering
    _.merge(props, extraProps);

    component = ComponentTree.render({
      component: ComponentPlayground,
      snapshot: props,
      container: document.createElement('div')
    });

    childParams = component.children.preview.call(component);
  }

  beforeEach(function() {
    // Don't render any children
    sinon.stub(ComponentTree.loadChild, 'loadChild');

    props = {
      fixtures: {}
    };
  });

  afterEach(function() {
    ComponentTree.loadChild.loadChild.restore();
  })

  describe('children', function() {
    it('should not render child without fixture contents', function() {
      render();

      expect(ComponentTree.loadChild.loadChild).to.not.have.been.called;
    });

    it('should render child with fixture contents', function() {
      render({
        state: {
          fixtureContents: {
            component: 'MyComponent'
          }
        }
      });

      expect(ComponentTree.loadChild.loadChild).to.have.been.called;
    });

    describe('with fixture contents', function() {
      beforeEach(function() {
        _.extend(props, {
          // Children draw their props from state.fixtureContents. Generating
          // state from props is tested in the state.js suite
          state: {
            fixtureContents: {
              component: 'MyComponent',
              width: 200,
              height: 100
            }
          }
        });
      });

      it('should send fixture contents to preview child', function() {
        render();

        var fixtureContents = component.state.fixtureContents;
        expect(childParams.component).to.equal(fixtureContents.component);
        expect(childParams.width).to.equal(fixtureContents.width);
        expect(childParams.height).to.equal(fixtureContents.height);
      });

      it('should use fixture contents as key for preview child', function() {
        render();

        var fixtureContents = component.state.fixtureContents,
            stringifiedFixtureContents = JSON.stringify(fixtureContents);

        expect(childParams.key).to.equal(stringifiedFixtureContents);
      });

      it('should clone fixture contents sent to child', function() {
        var obj = {};

        render({
          state: {
            fixtureContents: {
              shouldBeCloned: obj
            }
          }
        });

        expect(childParams.shouldBeCloned).to.not.equal(obj);
      });
    });
  });
});
