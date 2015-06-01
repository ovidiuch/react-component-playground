var React = require('react/addons'),
    ComponentTree = require('react-component-tree'),
    ComponentPlayground =
        require('../../../src/components/component-playground.jsx');

describe('ComponentPlayground component', function() {
  var utils = React.addons.TestUtils,
      component,
      container,
      params;

  function render(extraParams) {
    // Alow tests to extend fixture before rendering
    _.merge(params, extraParams);

    container = document.createElement('div');
    component = ComponentTree.render({
      component: ComponentPlayground,
      snapshot: params,
      container: container
    });
  };

  var triggerEditorEvent = function(event, eventData) {
    utils.Simulate[event](component.refs.editor.getDOMNode(), eventData);
  };

  var triggerEditorChange = function(value) {
    triggerEditorEvent('change', {target: {value: value}});
  };

  beforeEach(function() {
    sinon.stub(console, 'error');

    // Don't render any children
    sinon.stub(ComponentTree.loadChild, 'loadChild');

    params = {
      components: {},
      router: {
        goTo: sinon.spy(),
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
              'simple state': {},
              'complex state': {}
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

      it('should focus on editor on fixture click', function() {
        render({
          component: 'SecondComponent',
          fixture: 'simple state',
          editor: true
        });

        var editorNode = component.refs.editor.getDOMNode();
        sinon.spy(editorNode, 'focus');

        utils.Simulate.click(
            component.refs['SecondComponentsimple stateButton'].getDOMNode());

        expect(editorNode.focus).to.have.been.called;
      });

      describe('router links', function() {
        beforeEach(function() {
          render({
            component: 'SecondComponent',
            fixture: 'simple state'
          });
        });

        afterEach(function() {
          expect(params.router.routeLink).to.have.been.called;
        });

        it('should route link on home button', function() {
          utils.Simulate.click(component.refs.homeLink.getDOMNode());
        });

        it('should route link on fixture editor button', function() {
          utils.Simulate.click(component.refs.editorButton.getDOMNode());
        });

        it('should route link on full screen button', function() {
          utils.Simulate.click(component.refs.fullScreenButton.getDOMNode());
        });
      });

      describe('on fixture button click', function() {
        beforeEach(function() {
          render({
            component: 'SecondComponent',
            fixture: 'simple state',
            state: {
              fixtureChange: 10
            }
          });
        });

        it('should route link on new fixture', function() {
          utils.Simulate.click(
              component.refs['SecondComponentcomplex stateButton']
                       .getDOMNode());

          expect(params.router.goTo).to.have.been.called;
        });

        describe('on already selected fixture', function() {
          var stateSet;

          beforeEach(function() {
            sinon.spy(component, 'setState');

            utils.Simulate.click(
                component.refs['SecondComponentsimple stateButton']
                         .getDOMNode());

            stateSet = component.setState.lastCall.args[0];
          });

          it('should not route link', function() {
            expect(params.router.goTo).to.not.have.been.called;
          });

          it('should reset state', function() {
            expect(stateSet.expandedComponents.length).to.equal(1);
            expect(stateSet.expandedComponents[0]).to.equal('SecondComponent');
            expect(stateSet.fixtureContents).to.deep.equal(
                params.components.SecondComponent.fixtures['simple state']);
            expect(stateSet.fixtureUserInput).to.equal('{}');
            expect(stateSet.isFixtureUserInputValid).to.equal(true);
          });

          it('should bump fixture change', function() {
            expect(stateSet.fixtureChange)
                  .to.equal(params.state.fixtureChange + 1);
          });
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
          component: 'MyComponent',
          fixture: 'simple state',
          editor: true,
          state: {
            fixtureContents: {
              lorem: 'dolor sit'
            },
            fixtureChange: 5
          }
        });
      });

      it('should set state flag on editor focus', function() {
        triggerEditorEvent('focus');

        expect(component.state.isEditorFocused).to.equal(true);
      });

      it('should unset state flag on editor blur', function() {
        triggerEditorEvent('blur');

        expect(component.state.isEditorFocused).to.equal(false);
      });

      it('should update fixture user input on change', function() {
        triggerEditorChange('lorem ipsum');

        expect(component.state.fixtureUserInput).to.equal('lorem ipsum');
      });

      it('should empty fixture contents on empty input', function() {
        triggerEditorChange('');

        expect(component.state.fixtureContents).to.deep.equal({});
      });

      describe('on valid change', function() {
        beforeEach(function() {
          triggerEditorChange('{"lorem": "ipsum"}');
        });

        it('should update fixture contents', function() {
          expect(component.state.fixtureContents.lorem).to.equal('ipsum');
        });

        it('should mark valid change in state', function() {
          expect(component.state.isFixtureUserInputValid).to.equal(true);
        });

        it('should bump fixture change counter', function() {
          expect(component.state.fixtureChange)
                .to.equal(params.state.fixtureChange + 1);
        });
      });

      describe('on invalid change', function() {
        beforeEach(function() {
          triggerEditorChange('lorem ipsum');
        });

        it('should not update fixture contents', function() {
          expect(component.state.fixtureContents.lorem).to.equal('dolor sit');
        });

        it('should call console.error', function() {
          expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
        });

        it('should mark invalid change in state', function() {
          expect(component.state.isFixtureUserInputValid).to.equal(false);
        });

        it('should not bump fixture change counter', function() {
          expect(component.state.fixtureChange)
                .to.equal(params.state.fixtureChange);
        });
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
          component: 'MyComponent',
          fixture: 'simple state',
          editor: true
        });

        render();
      });

      it('should override fixture contents with user input',
         function() {
        triggerEditorChange('{"customProp": true}');

        expect(component.state.fixtureContents.customProp).to.equal(true);
        expect(component.state.fixtureContents.defaultProp).to.equal(undefined);
      });

      it('should not alter the original fixture contents', function() {
        triggerEditorChange('{"nested": {"nestedProp": false}}');

        expect(params.components.MyComponent
               .fixtures['simple state'].nested.nestedProp).to.be.true;
      });
    });

    describe('refreshing fixture contents', function() {
      var timeoutId = 555;

      beforeEach(function() {
        sinon.stub(window, 'setInterval').returns(timeoutId);
        sinon.stub(window, 'clearInterval');
      });

      afterEach(function() {
        window.setInterval.restore();
        window.clearInterval.restore();
      });

      it('should register interval on mount', function() {
        render();

        var setIntervalArgs = window.setInterval.lastCall.args;
        expect(setIntervalArgs[0]).to.equal(component.onFixtureUpdate);
        expect(setIntervalArgs[1]).to.equal(100);
      });

      it('should clear interval on unmount', function() {
        render();
        React.unmountComponentAtNode(container);

        expect(window.clearInterval).to.have.been.calledWith(timeoutId);
      });

      describe('on callback', function() {
        var childSnapshot = {
              unserializableProp: function() {},
              serializableProp: 3
            },
            stringifiedChildSnapshot = '{"serializableProp":3}';

        beforeEach(function() {
          sinon.stub(ComponentTree, 'serialize').returns(childSnapshot);
          sinon.stub(JSON, 'stringify').returns(stringifiedChildSnapshot);

          params.components = {
            FirstComponent: {},
            SecondComponent: {
              fixtures: {
                'simple state': {
                  unserializableProp: function() {},
                  serializableProp: 3
                }
              }
            }
          };
        });

        afterEach(function() {
          ComponentTree.serialize.restore();
          JSON.stringify.restore();
        });

        it('should not set state when fixture is not selected', function() {
          render();

          sinon.spy(component, 'setState');
          component.onFixtureUpdate();

          expect(component.setState).to.not.have.been.called;
        });

        describe('with fixture selected', function() {
          beforeEach(function() {
            params.component = 'SecondComponent';
            params.fixture = 'simple state';
          });

          it('should not set state when editor is focused', function() {
            render({
              state: {
                isEditorFocused: true
              }
            });

            sinon.spy(component, 'setState');
            component.onFixtureUpdate();

            expect(component.setState).to.not.have.been.called;
          });

          describe('with editor blurred', function() {
            var fakeChild = {};

            beforeEach(function() {
              render();

              // Children are not rendered in this test suite
              component.refs.preview = fakeChild;

              sinon.spy(component, 'setState');
              component.onFixtureUpdate();
            });

            it('should mark user input state as valid', function() {
              var stateSet = component.setState.lastCall.args[0];
              expect(stateSet.isFixtureUserInputValid).to.equal(true);
            });

            it('should serialize preview child', function() {
              expect(ComponentTree.serialize)
                    .to.have.been.calledWith(fakeChild);
            });

            it('should update child snapshot state', function() {
              var stateSet = component.setState.lastCall.args[0];
              expect(stateSet.fixtureContents.serializableProp)
                    .to.equal(childSnapshot.serializableProp);

              // Unserializable props are ignored
              expect(stateSet.fixtureContents.unserializableProp)
                    .to.equal(undefined);
            });

            it('should stringify preview child snapshot', function() {
              var stringifiedObj = JSON.stringify.lastCall.args[0];
              expect(stringifiedObj.serializableProp)
                    .to.equal(childSnapshot.serializableProp);

              // Unserializable props are ignored
              expect(stringifiedObj.unserializableProp)
                    .to.equal(undefined);
            });

            it('should update stringified child snapshot state', function() {
              var stateSet = component.setState.lastCall.args[0];
              expect(stateSet.fixtureUserInput)
                    .to.equal(stringifiedChildSnapshot);
            });
          });
        });
      });
    });
  });
});
