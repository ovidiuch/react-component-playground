var FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('tests/lib/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({container, component, $component} = render(fixture));

    sinon.spy(component, 'setState');
  });

  afterEach(function() {
    component.setState.restore();
  });

  describe('orientation', function() {
    afterEach(function() {
      component.refs.contentFrame.getDOMNode.restore();
    });

    it('should be set to landscape on width > height', function() {
      sinon.stub(component.refs.contentFrame, 'getDOMNode').returns({
        offsetWidth: 300,
        offsetHeight: 200
      });

      component.onWindowResize();

      expect(component.setState.args[0][0].orientation).to.equal('landscape');
    });

    it('should be set to landscape on width == height', function() {
      sinon.stub(component.refs.contentFrame, 'getDOMNode').returns({
        offsetWidth: 300,
        offsetHeight: 300
      });

      component.onWindowResize();

      expect(component.setState.args[0][0].orientation).to.equal('landscape');
    });

    it('should be set to portrait on width < height', function() {
      sinon.stub(component.refs.contentFrame, 'getDOMNode').returns({
        offsetWidth: 200,
        offsetHeight: 300
      });

      component.onWindowResize();

      expect(component.setState.args[0][0].orientation).to.equal('portrait');
    });
  });
});
