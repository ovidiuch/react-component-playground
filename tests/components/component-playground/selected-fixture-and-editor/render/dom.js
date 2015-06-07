var FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Render DOM`, function() {
  var $ = require('jquery'),
      render = require('tests/lib/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({container, component, $component} = render(fixture));
  });

  it('should render fixture editor', function() {
    expect(component.refs.editor).to.exist;
  });

  it('should add aside class on preview container', function() {
    expect($(component.refs.previewContainer.getDOMNode())
           .hasClass('aside-fixture-editor')).to.be.true;
  });

  it('should add selected class on editor button', function() {
    // XXX: Class is set on button parent
    expect($(component.getDOMNode())
           .find('.fixture-editor-button')
           .hasClass('selected-button')).to.be.true;
  });

  it('should populate editor textarea from state', function() {
    component.setState({
      fixtureUserInput: 'lorem ipsum'
    });

    expect(component.refs.editor.getDOMNode().value).to.equal('lorem ipsum');
  });

  it('should add invalid class on editor on state flag', function() {
    component.setState({
      isFixtureUserInputValid: false
    });

    expect($(component.refs.editor.getDOMNode())
           .hasClass('invalid-syntax')).to.be.true;
  });
});
