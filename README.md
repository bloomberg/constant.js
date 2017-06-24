# Constant.JS

A minimalistic javascript constant object library. It utilises `Object.freeze` to prevent
mutations, however it does *deep-freeze* objects making them truly constant.

The constant object is identical (`obj === constant(obj)`), so it does in fact freeze the original
objects. Accessing properties can therefore be done in the standard JS way (`obj.prop` or `obj[propname]`).

There are also convenience access methods and mutation methods supported making handling of
constant object hierarchies easy.

## Installation

```shell
npm install --save constant.js
npm test
```

This library has *100%* test coverage. Pull requests are always welcome, however they will only be accepted if the test-coverage remains at 100%.

## Static Functions

### `constant(object)`

Converts an object to an constant version.

### `constant.parse(string)`

Parses a JSON string into an constant object.

### `constant.is(object)`

Tests if an object has been made constant.

### `constant.isArray(object)`

Tests if an object is an Array and has been made constant.

### `constant.isObject(object)`

Tests if an object is a plain Object and has been made constant.

### `constant.isDate(object)`

Tests if an object is a Date and has been made constant.

### `constant.isRegExp(object)`

Tests if an object is a RegExp and has been made constant.

## Common Methods

These methods a available on all constant objects whether they be plain Objects, Arrays or Dates. All prototype methods remain available, but using modifying methods (if they have not been implemented here) will throw in strict mode or not have an effect in non-strict mode.

### `constantObject.mutate(path, method[, arg, ...])`

This method performs a deep mutation on an object by calling one of its child's methods.

Example:

```javascript
var obj = constant({ a: { b: [ new Date(0) ] } });
var res = obj.mutate([ 'a', 'b', '0' ], 'setFullYear', 1900);
JSON.stringify(res); // { "a": { "b": [ "1900-01-01T00:00:00.000Z"] } }
```

### `constantObject.get()`

This method gets a value deep inside an object hierarchy.

Example:

```javascript
var obj = constant({ a: { b: { c: 'value' } } });
obj.get('a', 'b', 'c'); // 'value'
```

### `constantObject.set()`

This method sets a value deep inside an object hierarchy and returns a new constant object
containing the change. The original constant remains unchanged. This method ensures that all
values that remain unchanged will be reused. If the "change" isn't actually a change the return
value will be the same object.

Example:

```javascript
var obj = constant({ a: { b: { c: 'value' } }, d: { other: 'branch' } });
var chg = obj.set('a', 'b', 'c', 'new-value');
chg.d === obj.d; // true
chg.a.b.c; // 'new-value'
obj.a.b.c; // 'value'
chg = obj.set('a', 'b', 'c', 'value');
chg === obj; // true
```

### `constantObject.mutable()`

Creates a shallow mutable version of the object. It's children in the hierarchy remain constant.

Example:

```javascript
var obj = constant({ a: { b: { c: 'value' } }, d: { other: 'branch' } });
var mut = obj.mutable();
constant.isObject(mut); // false
constant.isObject(mut.a); // true
constant.isObject(mut.d); // true
mut.f = 'hallo';
mut.f; // 'hallo';
```

### `constantObject.toJS()`

Creates a deep mutable version of the object. This means that the entire hierarchy will be mutable.
It will retain cyclical integrity provided there is the global [`Map`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map) builtin.

If that is not the case, then a call on a cyclical constant object will loop indefinitely!

***Only use cyclical structures if you have a modern environment!***

Example:

```javascript
var obj = constant({ a: { b: { c: 'value' } }, d: { other: 'branch' } });
var mut = obj.mutable();
constant.isObject(mut); // false
constant.isObject(mut.a); // false
constant.isObject(mut.d); // false
mut.f = 'hallo';
mut.f; // 'hallo';
```

## Object Methods

### `constantObject.assign(obj[, obj[, ...]])`

Similar to `Object.assign` in that it merges object into a constant object. It then returns a new constant object where
the properties of the argument objects have been merged in.

```javascript
var obj = constant({ a: 'test', b: { c: true } });
var mut = obj.assign({ a: 'hallo', d: { e: 5 } });
constant.isObject(mut); // true
constant.isObject(mut.b); // true
constant.isObject(mut.d); // true
obj.b === mut.b; // true
JSON.stringify(mut); // {"a":"hallo","b":{"c":true},"d":{"e":5}}
```

### `constantObject.transform(transformFn, thisPointer)`

Works just like `Array.prototype.map` except on an object and that it returns a new constant object and
allows removal of an element by returning `undefined`.

Example:

```javascript
var obj = constant({ a: 1, b: 2, c: 3, d: 4, e: 5 });
mut = obj.transform(function(val, key) {
  return key === 'b' ? undefined : (val * 2);
});
constant.isObject(mut); // true
JSON.stringify(mut); // {"a": 2,"c":6,"d":8,"e":10}

mut = obj.transform(function(val) {
    return val;
});
obj === mut; //true
```

## Array Methods

All methods available trough `Array.prototype` are available on constant Array objects as well except that
modifying methods have been replaced with ones returning a new constant Array object instead.

### `constantArray.splice(idx, delcnt, insitem)`

Just like the regular `Array.prototype.splice` method except that rather than returning the
deleted elements, It returns a new constant Array with the changes applied. Also inserted
elements will become constant.

Example:

```javascript
var arr = constant([1, 2, 3, 4, 5]);
var mut = arr.splice(1,3, 'element');
constant.isArray(mut); // true
JSON.stringify(mut); // '[ 1, "element", 5 ]'
```

### `constantArray.concat(array)`

Just like the regular `Array.prototype.concat` method except that the resulting array is constant.

Example:

```javascript
var arr = constant([1, 2, 3 ]);
var mut = arr.concat([ 4, 5, 6 ]);
constant.isArray(mut); // true
JSON.stringify(mut); // '[ 1, 2, 3, 4, 5, 6 ]'
```

### `constantArray.reverse()`

Just like the regular `Array.prototype.reverse` method except that the resulting array is constant.

Example:

```javascript
var arr = constant([1, 2, 3, 4, 5, 6 ]);
var mut = arr.reverse();
constant.isArray(mut); // true
JSON.stringify(mut); // '[ 6, 5, 4, 3, 2, 1 ]'
```

### `constantArray.sort(sortFunction)`

Just like the regular `Array.prototype.sort` method except that the resulting array is constant.

Example:

```javascript
var arr = constant([ 6, 5, 4, 3, 2, 1 ]);
var mut = arr.reverse();
constant.isArray(mut); // true
JSON.stringify(mut); // '[1, 2, 3, 4, 5, 6 ]'
```

### `constantArray.insert(idx, element)`

Inserts a new element at a specified index. If element isn't constant it will be on insertion.

Example:

```javascript
var arr = constant([ 1, 2, 4, 5 ]);
var mut = arr.insert(2, 3);
constant.isArray(mut); // true
JSON.stringify(mut); // '[1, 2, 3, 4, 5 ]'
```

### `constantArray.delete()`

Removes an element from an array and returns the constant changed array.

Example:

```javascript
var arr = constant([ 1, 2, 3, 4, 5 ]);
var mut = arr.delete(2);
constant.isArray(mut); // true
JSON.stringify(mut); // '[1, 2, 4, 5 ]'
```

### `constantArray.shift()`

Removes the first element of an array and returns the changed constant array.

Example:

```javascript
var arr = constant([ 1, 2, 3, 4, 5 ]);
var mut = arr.shift();
constant.isArray(mut); // true
JSON.stringify(mut); // '[ 2, 3, 4, 5  ]'
```

### `constantArray.unshift(element)`

Adds an element at the beginning of an array. Returns a new constant array with that element.

Example:

```javascript
var arr = constant([ 1, 2, 3 ]);
var mut = arr.unshift(0);
constant.isArray(mut); // true
JSON.stringify(mut); // '[ 0, 1, 2, 3 ]'
```

### `constantArray.pop()`

Removes the last element of an array and returns the changed constant array.

Example:

```javascript
var arr = constant([ 1, 2, 3, 4, 5 ]);
var mut = arr.pop();
constant.isArray(mut); // true
JSON.stringify(mut); // '[ 1, 2, 3, 4 ]'
```

### `constantArray.push(element)`

Adds an element at the end of an array. Returns a new constant array with that element.

Example:

```javascript
var arr = constant([ 1, 2, 3 ]);
var mut = arr.push(4);
constant.isArray(mut); // true
JSON.stringify(mut); // '[ 1, 2, 3, 4 ]'
```

### `constantArray.transform(transformFn, thisPointer)`

Works just like `Array.prototype.map` except that it returns a new constant array and allows removal of an element by returning `undefined`.

Example:

```javascript
var arr = constant([ 0, 1, 2, 3, 4 ]);
var mut = arr.transform(function(val) {
  return val ? (val * 2) : undefined;
});
constant.isArray(mut); // true
JSON.stringify(mut); // '[ 2, 4, 6, 8 ]'
```

### `constantArray.first` and  `constantArray.last`

`.first` ist the first element in an array and `.last` is the last element in an array.

Example:

```javascript
var arr = constant([ 1, 2, 3]);
arr.first; // 1
arr.last; // 3
```

## Date Methods

All methods available trough `Date.prototype` are available on constant Date objects as well except that
modifying methods have been replaced with ones returning a new constant Date object instead.

### `constantDate.setDate()`

Works just like `Date.prototype.setDate` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setFullYear()`

Works just like `Date.prototype.setFullYear` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setHours()`

Works just like `Date.prototype.setHours` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setMilliseconds()`

Works just like `Date.prototype.setMilliseconds` except that rather than modifying the date, it returns
a new constant date with the change applied.

### `constantDate.setMinutes()`

Works just like `Date.prototype.setMinutes` except that rather than modifying the date, it returns a new constant
date with the change applied.

### `constantDate.setMonth()`

Works just like `Date.prototype.setMonth` except that rather than modifying the date, it returns a new constant
date with the change applied.

### `constantDate.setSeconds()`

Works just like `Date.prototype.setSeconds` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setTime()`

Works just like `Date.prototype.setTime` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setUTCDate()`

Works just like `Date.prototype.setUTCDate` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setUTCFullYear()`

Works just like `Date.prototype.setUTCFullYear` except that rather than modifying the date, it returns a new
constant date with the change applied.

### `constantDate.setUTCHours()`

Works just like `Date.prototype.setUTCHours` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setUTCMilliseconds()`

Works just like `Date.prototype.setUTCMilliseconds` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setUTCMinutes()`

Works just like `Date.prototype.setUTCMinutes` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setUTCMonth()`

Works just like `Date.prototype.setUTCMonth` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setUTCSeconds()`

Works just like `Date.prototype.setUTCSeconds` except that rather than modifying the date, it returns a new constant date with the change applied.

### `constantDate.setYear()`

Works just like `Date.prototype.setYear` except that rather than modifying the date, it returns a new constant date with the change applied.

## Custom Object Types

Some object types require more information to properly handle. This can be done by placing a property on the prototype.

```javascript
function MyClass() {}
MyClass.prototype[constant.COPY] = function() {
    var copy = new MyClass();
    copy.setValue(this.getValue());
    return copy;
};
MyClass.prototype[constant.COPY].proto = {};
MyClass.prototype[constant.COPY].proto.setValue = function(val) {
    var mut = this.mutable();
    mut.setValue(val);
    return constant(mut);
};
MyClass.isConstant = function(obj) {
    return constant.is(obj) && (obj[constant.COPY] === MyClass.prototype[constant.COPY]);
};
```

In this fashion it is possible to support any arbitrary object as a constant object and add custom methods for getting
mutated versions of them.
