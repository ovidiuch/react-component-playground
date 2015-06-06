var FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Events DOM`, function() {
  var React = require('react/addons'),
      utils = React.addons.TestUtils,
      render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  it('should mark expanded component on click', function() {
    utils.Simulate.click(component.refs.FirstComponentButton.getDOMNode());

    var expandedComponents = component.state.expandedComponents;
    expect(expandedComponents.length).to.equal(1);
    expect(expandedComponents[0]).to.equal('FirstComponent');
  });

  it('should keep expanding components click', function() {
    component.setState({
      expandedComponents: ['FirstComponent']
    })

    utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

    var expandedComponents = component.state.expandedComponents;
    expect(expandedComponents.length).to.equal(2);
    expect(expandedComponents[0]).to.equal('FirstComponent');
    expect(expandedComponents[1]).to.equal('SecondComponent');
  });

  it('should contract expanded component on click', function() {
    component.setState({
      expandedComponents: ['FirstComponent', 'SecondComponent']
    });

    utils.Simulate.click(component.refs.SecondComponentButton.getDOMNode());

    var expandedComponents = component.state.expandedComponents;
    expect(expandedComponents.length).to.equal(1);
    expect(expandedComponents[0]).to.equal('FirstComponent');
  });
});
