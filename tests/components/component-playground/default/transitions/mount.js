var FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Transitions Mount`, function() {
  var React = require('react'),
      render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  var timeoutId = 555;

  beforeEach(function() {
    sinon.stub(window, 'setInterval').returns(timeoutId);
    sinon.stub(window, 'clearInterval');

    ({fixture, container, component, $component} = render(originalFixture));
  });

  afterEach(function() {
    window.setInterval.restore();
    window.clearInterval.restore();
  });

  it('should register fixture update interval on mount', function() {
    var setIntervalArgs = window.setInterval.lastCall.args;
    expect(setIntervalArgs[0]).to.equal(component.onFixtureUpdate);
    expect(setIntervalArgs[1]).to.equal(100);
  });

  it('should clear fixture update interval on unmount', function() {
    React.unmountComponentAtNode(container);

    expect(window.clearInterval).to.have.been.calledWith(timeoutId);
  });

  describe('default state', function() {
    it('should have to no expanded components', function() {
      expect(component.state.expandedComponents.length).to.equal(0);
    });

    it('should have empty fixture contents', function() {
      expect(component.state.fixtureContents).to.deep.equal({});
    });

    it('should have empty object literal in fixture user input', function() {
      expect(component.state.fixtureUserInput).to.equal('{}');
    });

    it('should have fixture user input marked as valid', function() {
      expect(component.state.isFixtureUserInputValid).to.equal(true);
    });

    it('should have fixture change counter set to 0', function() {
      expect(component.state.fixtureChange).to.equal(0);
    });

    it('should have fixture editor marked as not focused', function() {
      expect(component.state.isEditorFocused).to.equal(false);
    });
  });
});
