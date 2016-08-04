var FIXTURE = 'selected-fixture-with-search';

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
  });

  it('should store the search input value in state', function() {
    component.onSearchChange({target: {value: 'index'}});

    expect(component.state.searchText).to.equal('index');
  });

  it('should filter the components', function() {
    expect(component._getFilteredFixtures()).to.have.all.keys(
        'FirstComponent', 'SecondComponent')
  });
});
