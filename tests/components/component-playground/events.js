var React = require('react/addons'),
    ComponentTree = require('react-component-tree'),
    ComponentPlayground =
        require('../../../src/components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var utils = React.addons.TestUtils,
      component,
      params;

  function render(extraParams) {
    // Alow tests to extend fixture before rendering
    _.merge(params, extraParams);

    component = ComponentTree.render({
      component: ComponentPlayground,
      snapshot: params,
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

    params = {
      components: {},
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
        params.components = {
          FirstComponent: {},
          SecondComponent: {
            fixtures: {
              'simple state': {}
            }
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
          expect(params.router.routeLink).to.have.been.called;
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
      beforeEach(function() {
        render({
          components: {
            MyComponent: {
              fixtures: {
                'simple state': {}
              }
            }
          },
          selectedComponent: 'MyComponent',
          selectedFixture: 'simple state',
          fixtureEditor: true,
          state: {
            fixtureContents: {
              lorem: 'dolor sit'
            }
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

        expect(component.state.fixtureContents.lorem).to.equal('dolor sit');
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

    describe('editing and extending fixture', function() {
      beforeEach(function() {
        _.assign(params, {
          components: {
            MyComponent: {
              fixtures: {
                'simple state': {
                  defaultProp: true,
                  nested: {
                    nestedProp: true
                  }
                }
              }
            }
          },
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

        expect(params.components.MyComponent
               .fixtures['simple state'].nested.nestedProp).to.be.true;
      });
    });
  });
});
