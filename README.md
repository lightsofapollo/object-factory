## Factory

Create and distribute test fixtures/factories.

## Usage

All examples assume you have required object-factory like this:

```js
var Factory = require('object-factory');
```

## Basic task syntax

```js
var Event = new Factory({
  properties: {
    // define defaults
    title: 'Amazing Event',
    location: 'Bahamas'
  }
});

var event = Event.build({ title: 'xxx' });
```

## Options for factories

When creating factories there are various options that can be passed.

### `.properties`

```js
new Factory({ 
  properties: {
    key: 'default value
    '
  } 
});
```

The `.properties` property (sorry) specify the default values for a
given factory.



### `.object`

```js

var MyThing = new Factory({ 
  object: ThingWithConstructorThatAcceptsObjects
});
```

As the fictional object might suggest object is the object that the
factories properties are passed into...

```js
// This operation

MyThing.create({ xfoo: true });

// Translates to this
new ThingWithConstructorThatAcceptsObjects({ xfoo: true })
```

### `.onbuild`

The `onbuild` property will be called if given _before_ the generated
properties are passed to the constructor `.object`.

```js
var BuildMe = new Factory({
  onbuild: function(builtObject) {
    // use this to customize the output of your factory for dynamic
    // values, etc...
  }
})
```

### `.oncreate`

The `oncreate` property will be called if given _after_ the generated
properties are passed to the constructor `.object`.

```js
var BuildMe = new Factory({
  object: Xfoo
  oncreate: function(object) {
    // (object instanceof Xfoo) === true
  }
})
```

## Composing factories

You can't create abritrarty depth in a factory. Each factory must be
one object deep but multiple factories can be referenced as properties
to create this nesting.

```js

var Person = new Factory({
  properties: {
    name: 'James Lal'  
  }
});

var Event = new Factory({
  properties: {
    // define defaults
    title: 'Amazing Event',
    location: 'Bahamas',
    person: Person
  }
});
```
## Inheritance

Factories can inherit from other factories:

```js

var Developer = Person.extend({
  properties: {
    OCD: true  
  }
});
```

## Testing Factories

object factory ships with a `object-factory-viewer` binary which will
pretty print the output of your factory given a module.

```js
// xfoo.js
module.exports = new Factory({
  properties: { xfoo: 'foo' }
});
```

```sh
./node_modules/.bin/object-factory-viewer xfoo.js
# will output the pretty printed (util.inspect) version of the factory.
```
If your not using .onbuild or .oncreate then this is a great way to test
the output of your factories. This serves as a good sanity check (and
could be used as documentation too).
