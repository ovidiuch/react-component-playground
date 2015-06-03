var $ = require('jquery'),
    ComponentTree = require('react-component-tree'),
    ComponentPlayground = require('components/component-playground.jsx');

module.exports = function(originalFixture) {
  var fixture = _.cloneDeep(originalFixture),
      container = document.createElement('div'),
      component,
      $component;

  component = ComponentTree.render({
    component: ComponentPlayground,
    snapshot: fixture,
    container: container
  });

  $component = $(component.getDOMNode());

  return {
    fixture: fixture,
    container: container,
    component: component,
    $component: $component
  };
};
