var React = require('react/addons'),
    ComponentTree = require('react-component-tree'),
    ComponentPlayground =
        require('../../../src/components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var utils = React.addons.TestUtils,
      component,
      props;

  function render(extraProps) {
    // Alow tests to extend fixture before rendering
    _.merge(props, extraProps);

    component = ComponentTree.render({
      component: ComponentPlayground,
      snapshot: props,
      container: document.createElement('div')
    });
  };

  var triggerChange = function(value) {
    utils.Simulate.change(component.refs.fixtureEditor.getDOMNode(),
                          {target: {value: value}});
  };

  beforeEach(function() {
    sinon.stub(console, 'error');

    // Don't render any children
    sinon.stub(ComponentTree.loadChild, 'loadChild');

    props = {
      fixtures: {},
      router: {
        routeLink: sinon.spy()
      }
    };
  });

  afterEach(function() {
    console.error.restore();

    ComponentTree.loadChild.loadChild.restore();
  })

  describe('events', function() {
    describe('clicking on components', function() {
      beforeEach(function() {
        props.fixtures = {
          FirstComponent: {},
          SecondComponent: {
            'simple state': {}
          }
        };
      });

      it('should expand component on click', function() {
        render();

        utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

        var expandedComponents = component.state.expandedComponents;
        expect(expandedComponents.length).to.equal(1);
        expect(expandedComponents[0]).to.equal('SecondComponent');
      });

      it('should keep expanding components click', function() {
        render({
          state: {
            expandedComponents: ['FirstComponent']
          }
        });

        utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

        var expandedComponents = component.state.expandedComponents;
        expect(expandedComponents.length).to.equal(2);
        expect(expandedComponents[0]).to.equal('FirstComponent');
        expect(expandedComponents[1]).to.equal('SecondComponent');
      });

      it('should contract expanded component on click', function() {
        render({
          state: {
            expandedComponents: ['FirstComponent', 'SecondComponent']
          }
        });

        utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

        var expandedComponents = component.state.expandedComponents;
        expect(expandedComponents.length).to.equal(1);
        expect(expandedComponents[0]).to.equal('FirstComponent');
      });

      describe('router links', function() {
        beforeEach(function() {
          render({
            selectedComponent: 'SecondComponent',
            selectedFixture: 'simple state'
          });
        });

        afterEach(function() {
          expect(props.router.routeLink).to.have.been.called;
        });

        it('should route link on home button', function() {
          utils.Simulate.click(component.refs.homeLink.getDOMNode());
        });

        it('should route link on component fixture button', function() {
          utils.Simulate.click(
              component.refs['SecondComponentsimple stateButton'].getDOMNode());
        });

        it('should route link on fixture editor button', function() {
          utils.Simulate.click(component.refs.fixtureEditorButton.getDOMNode());
        });

        it('should route link on full screen button', function() {
          utils.Simulate.click(component.refs.fullScreenButton.getDOMNode());
        });
      });
    });

    describe('editing fixture', function() {
      var initialFixtureContents = {
        myProp: 'dolor sit'
      };

      beforeEach(function() {
        render({
          fixtureEditor: true,
          state: {
            fixtureContents: initialFixtureContents
          }
        });
      });

      it('should update fixture user input on change', function() {
        triggerChange('lorem ipsum');

        expect(component.state.fixtureUserInput).to.equal('lorem ipsum');
      });

      it('should update fixture contents on valid change', function() {
        triggerChange('{"lorem": "ipsum"}');

        expect(component.state.fixtureContents.lorem).to.equal('ipsum');
      });

      it('should not update fixture contents on invalid change', function() {
        triggerChange('lorem ipsum');

        expect(component.state.fixtureContents.myProp)
               .to.equal(initialFixtureContents.myProp);
      });

      it('should empty fixture contents on empty input', function() {
        triggerChange('');

        expect(component.state.fixtureContents).to.deep.equal({});
      });

      it('should call console.error on invalid change', function() {
        triggerChange('lorem ipsum');

        expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
      });

      it('should mark valid change in state', function() {
        triggerChange('{"lorem": "ipsum"}');

        expect(component.state.isFixtureUserInputValid).to.equal(true);
      });

      it('should mark invalid change in state', function() {
        triggerChange('lorem ipsum');

        expect(component.state.isFixtureUserInputValid).to.equal(false);
      });
    });

    describe('editing fixture with selected fixture', function() {
      var fixtures = {
        MyComponent: {
          'simple state': {
            defaultProp: true,
            nested: {
              nestedProp: true
            }
          }
        }
      };

      beforeEach(function() {
        _.extend(props, {
          fixtures: fixtures,
          selectedComponent: 'MyComponent',
          selectedFixture: 'simple state',
          fixtureEditor: true
        });

        render();
      });

      it('should extend fixture contents with user input', function() {
        triggerChange('{"customProp": true}');

        expect(component.state.fixtureContents.customProp).to.equal(true);
        expect(component.state.fixtureContents.defaultProp).to.equal(true);
      });

      it('should not alter the original fixture contents', function() {
        triggerChange('{"nested": {"nestedProp": false}}');

        expect(fixtures.MyComponent['simple state'].nested.nestedProp)
              .to.be.true;
      });
    });
  });
});
