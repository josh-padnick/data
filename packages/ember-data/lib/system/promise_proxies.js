var Promise = Ember.RSVP.Promise;

/**
  A `PromiseArray` is an object that acts like both an `Ember.Array`
  and a promise. When the promise is resolved the resulting value
  will be set to the `PromiseArray`'s `content` property. This makes
  it easy to create data bindings with the `PromiseArray` that will be
  updated when the promise resolves.

  For more information see the [Ember.PromiseProxyMixin
  documentation](/api/classes/Ember.PromiseProxyMixin.html).

  Example

  ```javascript
  var promiseArray = DS.PromiseArray.create({
    promise: $.getJSON('/some/remote/data.json')
  });

  promiseArray.get('length'); // 0

  promiseArray.then(function() {
    promiseArray.get('length'); // 100
  });
  ```

  @class PromiseArray
  @namespace DS
  @extends Ember.ArrayProxy
  @uses Ember.PromiseProxyMixin
*/
var PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);

/**
  A `PromiseObject` is an object that acts like both an `Ember.Object`
  and a promise. When the promise is resolved, then the resulting value
  will be set to the `PromiseObject`'s `content` property. This makes
  it easy to create data bindings with the `PromiseObject` that will
  be updated when the promise resolves.

  For more information see the [Ember.PromiseProxyMixin
  documentation](/api/classes/Ember.PromiseProxyMixin.html).

  Example

  ```javascript
  var promiseObject = DS.PromiseObject.create({
    promise: $.getJSON('/some/remote/data.json')
  });

  promiseObject.get('name'); // null

  promiseObject.then(function() {
    promiseObject.get('name'); // 'Tomster'
  });
  ```

  @class PromiseObject
  @namespace DS
  @extends Ember.ObjectProxy
  @uses Ember.PromiseProxyMixin
*/
var PromiseObject = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

var promiseObject = function(promise, label) {
  return PromiseObject.create({
    promise: Promise.cast(promise, label)
  });
};

var promiseArray = function(promise, label) {
  return PromiseArray.create({
    promise: Promise.cast(promise, label)
  });
};

export {
  PromiseArray,
  PromiseObject,
  promiseArray,
  promiseObject
};
