var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Render DOM`, function() {
  var $ = require('jquery'),
      render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  it('should not render cosmos plug', function() {
    expect(component.refs.cosmosPlug).to.not.exist;
  });

  it('should add container class on preview element', function() {
    var $previewDOMNode = $(component.refs.previewContainer.getDOMNode());

    expect($previewDOMNode.hasClass(fixture.containerClassName)).to.be.true;
  });

  it('should add extra class to selected component', function() {
    var $expandedComponent = $component.find('.component.expanded');

    expect($expandedComponent.length).to.equal(1);
    expect($expandedComponent.find('.component-name').text())
          .to.equal('FirstComponent');
  });

  it('should add extra class to selected fixture', function() {
    var $fixture = $component.find('.component-fixture.selected');

    expect($fixture.length).to.equal(1);
    expect($fixture.text()).to.equal('default');
  });

  it('should render full screen button', function() {
    expect(component.refs.fullScreenButton).to.exist;
  });

  it('should render fixture editor button', function() {
    expect(component.refs.editorButton).to.exist;
  });
});
