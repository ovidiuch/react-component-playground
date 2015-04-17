# React Component Playground [![Build Status](https://travis-ci.org/skidding/react-component-playground.svg?branch=master)](https://travis-ci.org/skidding/react-component-playground) [![Coverage Status](https://coveralls.io/repos/skidding/react-component-playground/badge.svg?branch=master)](https://coveralls.io/r/skidding/react-component-playground?branch=master)

ComponentPlayground provides a minimal frame for loading and testing React
components in isolation.

Working with ComponentPlayground improves the component design because it
surfaces any implicit dependencies. It also forces us to define sane inputs for
every component, no matter how small, making them more predictable and easier
to debug down the road.

Features include:

- Rendering full-screen components or with the navigation pane on the side.
- Injecting predefined state into components via [ComponentTree](https://github.com/skidding/react-component-tree)
- Real-time editing of props and state with instant feedback

Before diving deeper, you need to understand what a component _fixture_ looks
like. It's the same thing as a snapshot in the ComponentTree utility. Read more
on the project [README](https://github.com/skidding/react-component-tree#componenttreeserialize).

`components` is by far the most important of the ComponentPlayground [props](https://github.com/skidding/react-component-playground/blob/master/src/components/component-playground.jsx#L19-L26).
This is an example:

```js
{
  ComponentOne: {
    class: require('./components/ComponentOne.jsx'),
    fixtures: {
      normal: {
        fooProp: 'bar'
      },
      paused: {
        fooProp: 'bar',
        state: {
          paused: true
        }
      }
    }
  },
  ComponentTwo: {
    class: require('./components/ComponentTwo.jsx'),
    fixtures: {
      //...
    }
  }
};
```
