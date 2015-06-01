var React = require('react/addons'),
    ComponentTree = require('react-component-tree'),
    ComponentPlayground =
        require('../../../src/components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var component,
      params;

  function render(extraProps) {
    // Alow tests to extend fixture before rendering
    _.merge(params, extraProps);

    component = ComponentTree.render({
      component: ComponentPlayground,
      snapshot: params,
      container: document.createElement('div')
    });
  };

  beforeEach(function() {
    sinon.stub(ComponentTree, 'injectState');

    params = {
      components: {
        FirstComponent: {
          class: 'FirstComponent',
          fixtures: {
            'blank state': {
              myProp: false,
              children: [
                React.createElement('span', {
                  children: 'test child'
                })
              ],
              state: {
                somethingHappened: true
              }
            }
          }
        },
        SecondComponent: {
          class: 'SecondComponent',
          fixtures: {
            'simple state': {
              myProp: true,
              state: {
                somethingHappened: false
              }
            }
          }
        }
      },
      router: {
        routeLink: sinon.spy()
      }
    };
  });

  afterEach(function() {
    ComponentTree.injectState.restore();
  })

  describe('state', function() {
    it('should default to no expanded components', function() {
      render();

      expect(component.state.expandedComponents.length).to.equal(0);
    });

    describe('with fixture selected', function() {
      beforeEach(function() {
        _.extend(params, {
          component: 'FirstComponent',
          fixture: 'blank state'
        });
      });

      it('should expand component from selected fixture', function() {
        render();

        var expandedComponents = component.state.expandedComponents;

        expect(expandedComponents.length).to.equal(1);
        expect(expandedComponents[0]).to.equal('FirstComponent');
      });

      it('should populate state with fixture contents', function() {
        render();

        expect(component.state.fixtureContents.myProp).to.equal(false);
      });

      it('should store unserializable props separately', function() {
        render();

        expect(component.state.fixtureContents.children).to.equal(undefined);
        expect(component.state.fixtureUnserializableProps.children)
              .to.equal(params.components.FirstComponent
                        .fixtures['blank state'].children);
      });

      it('should populate user input with stringified fixture contents',
         function() {
        render();

        var fixtureContents = component.state.fixtureContents;

        expect(component.state.fixtureUserInput)
              .to.equal(JSON.stringify(fixtureContents, null, 2));
      });

      it('should inject state to preview child', function() {
        render();

        var args = ComponentTree.injectState.lastCall.args;
        expect(args[0]).to.equal(component.refs.preview);
        expect(args[1].somethingHappened).to.equal(true);
      });

      describe('on fixture transition', function() {
        beforeEach(function() {
          render({
            state: {
              isFixtureUserInputValid: false
            }
          });

          component.setProps({
            component: 'SecondComponent',
            fixture: 'simple state'
          });
        });

        it('should expand both prev and new components', function() {
          var expandedComponents = component.state.expandedComponents;

          expect(expandedComponents.length).to.equal(2);
          expect(expandedComponents[0]).to.equal('FirstComponent');
          expect(expandedComponents[1]).to.equal('SecondComponent');
        });

        it('should reset fixture contents', function() {
          expect(component.state.fixtureContents.myProp).to.equal(true);
        });

        it('should reset unserializable fixture props', function() {
          expect(component.state.fixtureUnserializableProps)
                .to.deep.equal({});
        });

        it('should reset fixture user input', function() {
          var fixtureContents =
              params.components.FirstComponent.fixtures['blank state'];

          expect(JSON.parse(component.state.fixtureUserInput).myProp)
                .to.equal(true);
        });

        it('should reset valid user input flag', function() {
          expect(component.state.isFixtureUserInputValid).to.be.true;
        });

        it('should inject new state to preview child', function() {
          var args = ComponentTree.injectState.lastCall.args;
          expect(args[0]).to.equal(component.refs.preview);
          expect(args[1].somethingHappened).to.equal(false);
        });
      });

      it('should inject preview state again when fixture changes', function() {
        render({
          state: {
            fixtureChange: 5
          }
        });
        var injectStateCalls = ComponentTree.injectState.callCount;

        component.setState({
          fixtureChange: 6
        });

        expect(ComponentTree.injectState.callCount)
              .to.equal(injectStateCalls + 1);
      });
    });
  });
});
