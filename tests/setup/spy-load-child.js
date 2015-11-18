var ComponentTree = require('react-component-tree');

module.exports = function() {
  beforeEach(function() {
    sinon.spy(ComponentTree.loadChild, 'loadChild');
  });

  afterEach(function() {
    ComponentTree.loadChild.loadChild.restore();
  });
};
