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

  var triggerEditorChange = function(value) {
    utils.Simulate.change(component.refs.editor.getDOMNode(),
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

        it('should route link on component fixture button', function() {
          utils.Simulate.click(
              component.refs['SecondComponentsimple stateButton'].getDOMNode());
        });

        it('should route link on fixture editor button', function() {
          utils.Simulate.click(component.refs.editorButton.getDOMNode());
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
          component: 'MyComponent',
          fixture: 'simple state',
          editor: true,
          state: {
            fixtureContents: {
              lorem: 'dolor sit'
            }
          }
        });
      });

      it('should update fixture user input on change', function() {
        triggerEditorChange('lorem ipsum');

        expect(component.state.fixtureUserInput).to.equal('lorem ipsum');
      });

      it('should update fixture contents on valid change', function() {
        triggerEditorChange('{"lorem": "ipsum"}');

        expect(component.state.fixtureContents.lorem).to.equal('ipsum');
      });

      it('should not update fixture contents on invalid change', function() {
        triggerEditorChange('lorem ipsum');

        expect(component.state.fixtureContents.lorem).to.equal('dolor sit');
      });

      it('should empty fixture contents on empty input', function() {
        triggerEditorChange('');

        expect(component.state.fixtureContents).to.deep.equal({});
      });

      it('should call console.error on invalid change', function() {
        triggerEditorChange('lorem ipsum');

        expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
      });

      it('should mark valid change in state', function() {
        triggerEditorChange('{"lorem": "ipsum"}');

        expect(component.state.isFixtureUserInputValid).to.equal(true);
      });

      it('should mark invalid change in state', function() {
        triggerEditorChange('lorem ipsum');

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
          component: 'MyComponent',
          fixture: 'simple state',
          editor: true
        });

        render();
      });

      it('should extend fixture contents with user input', function() {
        triggerEditorChange('{"customProp": true}');

        expect(component.state.fixtureContents.customProp).to.equal(true);
        expect(component.state.fixtureContents.defaultProp).to.equal(true);
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
        expect(setIntervalArgs[1]).to.equal(400);
      });

      it('should clear interval on unmount', function() {
        render();
        React.unmountComponentAtNode(container);

        expect(window.clearInterval).to.have.been.calledWith(timeoutId);
      });

      describe("on callback", function() {
        var childSnapshot = {},
            stringifiedChildSnapshot = '{}';

        beforeEach(function() {
          sinon.stub(ComponentTree, 'serialize').returns(childSnapshot);
          sinon.stub(JSON, 'stringify').returns(stringifiedChildSnapshot);

          params.components = {
            FirstComponent: {},
            SecondComponent: {
              fixtures: {
                'simple state': {}
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

        describe("with fixture selected", function() {
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

          describe("with editor blurred", function() {
            var fakeChild = {};

            beforeEach(function() {
              render();

              // Children are not rendered in this test suite
              component.refs.preview = fakeChild;

              sinon.spy(component, 'setState');
              component.onFixtureUpdate();
            });

            it('should serialize preview child', function() {
              expect(ComponentTree.serialize)
                    .to.have.been.calledWith(fakeChild);
            });

            it('should set state with child snapshot', function() {
              var stateSet = component.setState.lastCall.args[0];
              expect(stateSet.fixtureContents).to.equal(childSnapshot);
            });

            it('should stringify preview child snapshot', function() {
              expect(JSON.stringify).to.have.been.calledWith(childSnapshot);
            });

            it('should set state with stringified child snapshot', function() {
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
