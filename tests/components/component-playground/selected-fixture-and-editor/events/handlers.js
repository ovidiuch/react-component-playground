var FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, function() {
  var ComponentTree = require('react-component-tree'),
      render = require('tests/lib/render-component.js'),
      originalFixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({fixture, container, component, $component} = render(originalFixture));
  });

  define('on fixture update', function() {
    var stateSet;

    beforeEach(function() {
      sinon.stub(ComponentTree, 'serialize').returns(_.merge({},
        fixture.state.fixtureContents,
        fixture.state.fixtureUnserializableProps));
      sinon.spy(component, 'setState');

      component.onFixtureUpdate();

      stateSet = component.setState.lastCall.args[0];
    });

    afterEach(function() {
      ComponentTree.serialize.restore();
      component.setState.restore();
    });

    it('should mark user input state as valid', function() {
      expect(stateSet.isFixtureUserInputValid).to.equal(true);
    });

    it('should serialize preview child', function() {
      expect(ComponentTree.serialize)
            .to.have.been.calledWith(component.refs.preview);
    });

    it('should put serializable child state in fixture contents', function() {
      for (var key in fixture.state.fixtureContents) {
        expect(stateSet.fixtureContents[key])
              .to.deep.equal(fixture.state.fixtureContents[key]);
      }
    });

    it('should ignore unserializable child state', function() {
      for (var key in fixture.state.fixtureUnserializableProps) {
        expect(stateSet.fixtureContents[key]).to.be.undefined;
      }
    });

    it('should update stringified child snapshot state', function() {
      expect(stateSet.fixtureUserInput)
            .to.equal(JSON.stringify(fixture.state.fixtureContents, null, 2));
    });
  });
});
