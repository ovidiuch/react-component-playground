require('./component-playground.less');

var _ = require('lodash'),
    React = require('react'),
    classNames = require('classnames'),
    ComponentTree = require('react-component-tree'),
    stringifyParams = require('react-querystring-router').uri.stringifyParams,
    parseLocation = require('react-querystring-router').uri.parseLocation,
    isSerializable = require('../lib/is-serializable.js').isSerializable;

module.exports = React.createClass({
  /**
   * ComponentPlayground provides a minimal frame for loading React components
   * in isolation. It can either render the component full-screen or with the
   * navigation pane on the side.
   */
  displayName: 'ComponentPlayground',

  mixins: [ComponentTree.Mixin],

  propTypes: {
    components: React.PropTypes.object.isRequired,
    component: React.PropTypes.string,
    fixture: React.PropTypes.string,
    editor: React.PropTypes.bool,
    fullScreen: React.PropTypes.bool,
    containerClassName: React.PropTypes.string
  },

  statics: {
    getExpandedComponents: function(props, alreadyExpanded) {
      if (!props.component || _.contains(alreadyExpanded, props.component)) {
        return alreadyExpanded;
      }

      return alreadyExpanded.concat(props.component);
    },

    isFixtureSelected: function(props) {
      return props.component && props.fixture;
    },

    didFixtureChange: function(prevProps, nextProps) {
      return prevProps.component !== nextProps.component ||
             prevProps.fixture !== nextProps.fixture;
    },

    getSelectedComponentClass: function(props) {
      return props.components[props.component].class;
    },

    getSelectedFixtureContents: function(props) {
      return props.components[props.component]
                  .fixtures[props.fixture];
    },

    getStringifiedFixtureContents: function(fixtureContents) {
      return JSON.stringify(fixtureContents, null, 2);
    },

    getFixtureState: function(props, expandedComponents) {
      var state = {
        expandedComponents:
            this.getExpandedComponents(props, expandedComponents),
        fixtureContents: {},
        fixtureUnserializableProps: {},
        fixtureUserInput: '{}',
        isFixtureUserInputValid: true
      };

      if (this.isFixtureSelected(props)) {
        var originalFixtureContents = this.getSelectedFixtureContents(props),
            fixtureContents = {},
            fixtureUnserializableProps = {};

        // Unserializable props are stored separately from serializable ones
        // because the serializable props can be overriden by the user using
        // the editor, while the unserializable props are always attached
        // behind the scenes
        _.forEach(originalFixtureContents, function(value, key) {
          if (isSerializable(value)) {
            fixtureContents[key] = value;
          } else {
            fixtureUnserializableProps[key] = value;
          }
        });

        _.assign(state, {
          fixtureContents: fixtureContents,
          fixtureUnserializableProps: fixtureUnserializableProps,
          fixtureUserInput: this.getStringifiedFixtureContents(fixtureContents)
        });
      }

      return state;
    }
  },

  getDefaultProps: function() {
    return {
      editor: false,
      fullScreen: false
    };
  },

  getInitialState: function() {
    var defaultState = {
      fixtureChange: 0,
      isEditorFocused: false
    };

    return _.assign(defaultState,
                    this.constructor.getFixtureState(this.props, []));
  },

  children: {
    preview: function() {
      var params = {
        component: this.constructor.getSelectedComponentClass(this.props),
        // Child should re-render whenever fixture changes
        key: this._getPreviewComponentKey()
      };

      // Shallow apply unserializable props
      _.assign(params, this.state.fixtureUnserializableProps);

      return _.merge(params, _.omit(this.state.fixtureContents, 'state'));
    }
  },

  render: function() {
    var isFixtureSelected = this.constructor.isFixtureSelected(this.props);

    var classes = classNames({
      'component-playground': true,
      'full-screen': this.props.fullScreen
    });

    return (
      <div className={classes}>
        <div className="header">
          {isFixtureSelected ? this._renderButtons() : null}
          <h1>
            <a ref="homeLink"
               href={stringifyParams({})}
               className="home-link"
               onClick={this.props.router.routeLink}>
              <span className="react">React</span> Component Playground
            </a>
            {!isFixtureSelected ? this._renderCosmosPlug() : null}
          </h1>
        </div>
        <div className="fixtures">
          {this._renderFixtures()}
        </div>
        {isFixtureSelected ? this._renderContentFrame() : null}
      </div>
    );
  },

  _renderCosmosPlug: function() {
    return <span ref="cosmosPlug" className="cosmos-plug">
      {'powered by '}
      <a href="https://github.com/skidding/cosmos">Cosmos</a>
    </span>;
  },

  _renderFixtures: function() {
    return <ul className="components">
      {_.map(this.props.components, function(component, componentName) {

        var classes = classNames({
          'component': true,
          'expanded': _.contains(this.state.expandedComponents, componentName)
        });

        return <li className={classes} key={componentName}>
          <p className="component-name">
            <a ref={componentName + 'Button'}
               href="#toggle-component"
               title={componentName}
               onClick={_.partial(this.onComponentClick, componentName)}>
              {componentName}
            </a>
          </p>
          {this._renderComponentFixtures(componentName, component.fixtures)}
        </li>;

      }.bind(this))}
    </ul>
  },

  _renderComponentFixtures: function(componentName, fixtures) {
    return <ul className="component-fixtures">
      {_.map(fixtures, function(props, fixtureName) {

        var fixtureProps = this._extendFixtureRoute({
          component: componentName,
          fixture: fixtureName
        });

        return <li className={this._getFixtureClasses(componentName,
                                                      fixtureName)}
                   key={fixtureName}>
          <a ref={componentName + fixtureName + 'Button'}
             href={stringifyParams(fixtureProps)}
             title={fixtureName}
             onClick={this.onFixtureClick}>
            {fixtureName}
          </a>
        </li>;

      }.bind(this))}
    </ul>;
  },

  _renderContentFrame: function() {
    return <div className="content-frame">
      <div ref="previewContainer" className={this._getPreviewClasses()}>
        {this.loadChild('preview')}
      </div>
      {this.props.editor ? this._renderFixtureEditor() : null}
    </div>
  },

  _renderFixtureEditor: function() {
    var editorClasses = classNames({
      'fixture-editor': true,
      'invalid-syntax': !this.state.isFixtureUserInputValid
    });

    return <div className="fixture-editor-outer">
      <textarea ref="editor"
                className={editorClasses}
                value={this.state.fixtureUserInput}
                onFocus={this.onEditorFocus}
                onBlur={this.onEditorBlur}
                onChange={this.onFixtureChange}>
      </textarea>
    </div>;
  },

  _renderButtons: function() {
    return <ul className="buttons">
      {this._renderFixtureEditorButton()}
      {this._renderFullScreenButton()}
    </ul>;
  },

  _renderFixtureEditorButton: function() {
    var classes = classNames({
      'fixture-editor-button': true,
      'selected-button': this.props.editor
    });

    var editorUrlProps = this._extendFixtureRoute({
      editor: !this.props.editor
    });

    return <li className={classes}>
      <a href={stringifyParams(editorUrlProps)}
         ref="editorButton"
         onClick={this.props.router.routeLink}>Editor</a>
    </li>;
  },

  _renderFullScreenButton: function() {
    var fullScreenProps = this._extendFixtureRoute({
      fullScreen: true,
      editor: false
    });

    return <li className="full-screen-button">
      <a href={stringifyParams(fullScreenProps)}
         ref="fullScreenButton"
         onClick={this.props.router.routeLink}>Fullscreen</a>
    </li>;
  },

  componentDidMount: function() {
    this._fixtureUpdateInterval = setInterval(this.onFixtureUpdate, 100);

    if (this.refs.preview) {
      this._injectPreviewChildState();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.constructor.didFixtureChange(this.props, nextProps)) {
      this.setState(this.constructor.getFixtureState(
          nextProps, this.state.expandedComponents));
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // This is pretty wasteful, but it's more important to make sure the loaded
    // component doesn't render on every onFixtureUpdate loop, unless its state
    // changed
    return !_.isEqual(this.props, nextProps) ||
           !_.isEqual(_.omit(this.state, 'isEditorFocused'),
                      _.omit(nextState, 'isEditorFocused'));
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.refs.preview && (
        this.constructor.didFixtureChange(prevProps, this.props) ||
        prevState.fixtureChange !== this.state.fixtureChange)) {
      this._injectPreviewChildState();
    }
  },

  componentWillUnmount: function() {
    clearInterval(this._fixtureUpdateInterval);
  },

  onComponentClick: function(componentName, event) {
    event.preventDefault();

    var currentlyExpanded = this.state.expandedComponents,
        componentIndex = currentlyExpanded.indexOf(componentName),
        toBeExpanded;

    if (componentIndex !== -1) {
      toBeExpanded = _.clone(currentlyExpanded);
      toBeExpanded.splice(componentIndex, 1);
    } else {
      toBeExpanded = currentlyExpanded.concat(componentName);
    }

    this.setState({expandedComponents: toBeExpanded});
  },

  onFixtureClick: function(event) {
    event.preventDefault();

    var location = event.currentTarget.href,
        params = parseLocation(location);

    if (this.constructor.didFixtureChange(this.props, params)) {
      this.props.router.goTo(location);
    } else {
      // This happens when we want to reset a fixture to its original state by
      // clicking on the fixture button while already selected
      var originalState =
          this.constructor.getFixtureState(this.props,
                                           this.state.expandedComponents);

      // We also need to bump fixtureChange to trigger a key change for the
      // preview child, because the component and fixture names didn't change
      this.setState(_.assign(originalState, {
        fixtureChange: this.state.fixtureChange + 1
      }));
    }

    // Focus on the editor when changing fixture, to prevent overriding
    // its contents with the state generated by the initial unfolding of the
    // rendered component tree
    if (this.props.editor) {
      this._focusOnEditor();
    }
  },

  onEditorFocus: function(event) {
    this.setState({isEditorFocused: true});
  },

  onEditorBlur: function(event) {
    this.setState({isEditorFocused: false});
  },

  onFixtureUpdate: function() {
    if (!this.refs.preview ||
        // Don't update fixture contents while the user is editing the fixture
        this.state.isEditorFocused) {
      return;
    }

    var snapshot = ComponentTree.serialize(this.refs.preview);

    // Continue to ignore unserializable props
    var serializableSnapshot =
        _.omit(snapshot, _.keys(this.state.fixtureUnserializableProps));

    this.setState({
      fixtureContents: serializableSnapshot,
      fixtureUserInput:
          this.constructor.getStringifiedFixtureContents(serializableSnapshot),
      isFixtureUserInputValid: true
    });
  },

  onFixtureChange: function(event) {
    var userInput = event.target.value,
        newState = {fixtureUserInput: userInput};

    try {
      var fixtureContents = {};

      if (userInput) {
        _.merge(fixtureContents, JSON.parse(userInput));
      }

      _.assign(newState, {
        fixtureContents: fixtureContents,
        fixtureChange: this.state.fixtureChange + 1,
        isFixtureUserInputValid: true
      });
    } catch (e) {
      newState.isFixtureUserInputValid = false;
      console.error(e);
    }

    this.setState(newState);
  },

  _getPreviewComponentKey: function() {
    return this.props.component + '-' +
           this.props.fixture + '-' +
           this.state.fixtureChange;
  },

  _getPreviewClasses: function() {
    var classes = {
      'preview': true,
      'aside-fixture-editor': this.props.editor
    };

    if (this.props.containerClassName) {
      classes[this.props.containerClassName] = true;
    }

    return classNames(classes);
  },

  _getFixtureClasses: function(componentName, fixtureName) {
    var classes = {
      'component-fixture': true
    };

    classes['selected'] = componentName === this.props.component &&
                          fixtureName === this.props.fixture;

    return classNames(classes);
  },

  _extendFixtureRoute: function(newProps) {
    var currentProps = {
      component: this.props.component,
      fixture: this.props.fixture,
      editor: this.props.editor,
      fullScreen: this.props.fullScreen
    };

    var defaultProps = this.constructor.getDefaultProps(),
        props = _.assign(_.omit(currentProps, _.keys(newProps)), newProps);

    // No need to include props with default values
    return _.omit(props, function(value, key) {
      return value === defaultProps[key];
    });
  },

  _focusOnEditor: function() {
    this.refs.editor.getDOMNode().focus();
  },

  _injectPreviewChildState: function() {
    var state = this.state.fixtureContents.state;

    if (!_.isEmpty(state)) {
      ComponentTree.injectState(this.refs.preview, _.cloneDeep(state));
    }
  }
});
