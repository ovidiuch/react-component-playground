var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Events DOM`, function() {
  var React = require('react/addons'),
      utils = React.addons.TestUtils,
      _ = require('lodash'),
      render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  var stubbedFixture = _.assign({}, originalFixture, {
    router: {
      goTo: sinon.spy(),
      routeLink: sinon.spy()
    }
  });

  beforeEach(function() {
    ({fixture, container, component, $component} = render(stubbedFixture));
  });

  afterEach(function() {
    stubbedFixture.router.goTo.reset();
    stubbedFixture.router.routeLink.reset();
  });

  it('should route link on home button', function() {
    utils.Simulate.click(component.refs.homeLink.getDOMNode());

    expect(component.props.router.routeLink).to.have.been.called;
  });

  it('should route link on editor button', function() {
    utils.Simulate.click(component.refs.editorButton.getDOMNode());

    expect(component.props.router.routeLink).to.have.been.called;
  });

  it('should route link on full screen button', function() {
    utils.Simulate.click(component.refs.fullScreenButton.getDOMNode());

    expect(component.props.router.routeLink).to.have.been.called;
  });

  it('should route link on new fixture button', function() {
    utils.Simulate.click(
        component.refs['FirstComponenterrorButton'].getDOMNode());

    expect(component.props.router.goTo).to.have.been.called;
  });

  describe('Clicking button of already selected fixture', function() {
    var stateSet;

    beforeEach(function() {
      sinon.spy(component, 'setState');

      utils.Simulate.click(
          component.refs['FirstComponentdefaultButton'].getDOMNode());

      stateSet = component.setState.lastCall.args[0];
    });

    beforeEach(function() {
      component.setState.restore();
    });

    it('should not route link', function() {
      expect(component.props.router.goTo).to.not.have.been.called;
    });

    it('should reset state', function() {
      var fixtureContents =
          fixture.components.FirstComponent.fixtures['default'];

      expect(stateSet.expandedComponents.length).to.equal(1);
      expect(stateSet.expandedComponents[0]).to.equal('FirstComponent');
      expect(stateSet.fixtureContents).to.equal(fixtureContents);
      expect(stateSet.fixtureUserInput).to.equal(
          JSON.stringify(fixtureContents, null, 2));
      expect(stateSet.isFixtureUserInputValid).to.equal(true);
    });

    it('should bump fixture change', function() {
      expect(stateSet.fixtureChange).to.equal(fixture.state.fixtureChange + 1);
    });
  });
});
