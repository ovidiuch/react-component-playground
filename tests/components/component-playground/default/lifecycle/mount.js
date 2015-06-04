var FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Lifecycle Mount`, function() {
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
});
