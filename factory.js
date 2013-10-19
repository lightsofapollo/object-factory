function propIsFactory(object, key) {
  var descriptor = Object.getOwnPropertyDescriptor(
    object, key
  );

  if (!descriptor) {
    return false;
  }

  return (
    descriptor.value &&
    (descriptor.value instanceof Factory)
  );
}

/**
 * Copy a set of property descriptors from
 * one object to another
 */
function copyProp(from, keys, to) {
  var list = [].concat(keys);
  list.forEach(function(key) {
    if (!from.hasOwnProperty(key)) {
      return;
    }
    Object.defineProperty(
      to,
      key,
      Object.getOwnPropertyDescriptor(
        from,
        key
      )
    );
  });

  return to;
}

/**
 * Copies all properties
 * (in order from left to right to the final argument)
 */
function copy() {
  var key;
  var args = Array.prototype.slice.call(arguments);
  var target = args.pop();

  args.forEach(function(object) {
    if (!object) {
      return;
    }

    for (key in object) {
      if (object.hasOwnProperty(key)) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(
            object,
            key
          )
        );
      }
    }
  });

  return target;
}

/* instance */

function Factory(options) {
  if (!(this instanceof Factory)) {
    return Factory.create.apply(Factory, arguments);
  }

  copy(options, this);

  return this;
}

Factory.prototype = {
  parent: null,
  object: null,
  properties: {},

  extend: function(options) {
    var newFactory = {};

    // we need to copy the prop
    // rather then do an assignment for lazy-est
    // possible evaluation of properties.
    copyProp(
      this,
      ['object', 'onbuild', 'oncreate'],
      newFactory
    );

    copy(options, newFactory);

    newFactory.properties = copy(
      this.properties,
      newFactory.properties,
      {}
    );

    return new Factory(newFactory);
  },

  build: function(overrides, childFactoryMethod) {
    if (typeof(overrides) === 'undefined') {
      overrides = {};
    }

    if (typeof(childFactoryMethod) === 'undefined') {
      childFactoryMethod = 'build';
    }


    var defaults = {};
    var key;
    var props = this.properties;

    copy(props, overrides, defaults);

    // expand factories
    var factoryOverrides;
    var descriptor;

    for (key in defaults) {
      // when default property is a factory
      if (propIsFactory(props, key)) {
        factoryOverrides = undefined;
        if (!propIsFactory(defaults, key)) {
          // user overrides defaults
          factoryOverrides = defaults[key];
        }
        defaults[key] = props[key][childFactoryMethod](
          factoryOverrides
        );
      }
    }

    if (typeof(this.onbuild) === 'function') {
      this.onbuild(defaults);
    }

    return defaults;
  },

  create: function(overrides) {
    var result;
    var constructor = this.object;
    var attrs = this.build(overrides, 'create');

    if (constructor) {
      result = new constructor(attrs);
    } else {
      result = attrs;
    }

    if (typeof(this.oncreate) === 'function') {
      this.oncreate(result);
    }

    return result;
  }
};

module.exports = Factory;
