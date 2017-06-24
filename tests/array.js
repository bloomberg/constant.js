/*
** Copyright 2017 Bloomberg Finance L.P.
**
** Licensed under the Apache License, Version 2.0 (the "License");
** you may not use this file except in compliance with the License.
** You may obtain a copy of the License at
**
**     http://www.apache.org/licenses/LICENSE-2.0
**
** Unless required by applicable law or agreed to in writing, software
** distributed under the License is distributed on an "AS IS" BASIS,
** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
** See the License for the specific language governing permissions and
** limitations under the License.
*/

'use strict';

var tap = require('tap');
var constant = require('../');

tap.test('array', function (test) {
  var obj = constant([0, 1, { a: 'value' }, 3]);

  test.equal(typeof obj.get, 'function', 'obj.get is a function');
  test.equal(typeof obj.set, 'function', 'obj.set is a function');
  test.equal(typeof obj.toJS, 'function', 'obj.toJS is a function');
  test.equal(typeof obj.mutable, 'function', 'obj.mutable is a function');
  test.equal(typeof obj.mutate, 'function', 'obj.mutate is a function');

  var mut = obj.mutable();
  test.equal(constant.isArray(obj), true);
  test.equal(constant.isArray(mut), false);
  test.equal(constant.isObject(obj[2]), true);
  test.equal(constant.isObject(mut[2]), true);
  test.deepEqual(mut, obj);

  test.equal(obj.get(2, 'a'), 'value');

  var mod = obj.set(2, 'a', 'modified');
  test.equal(obj[2].a, 'value');
  test.equal(mod[2].a, 'modified');

  mut = obj.set(2, 'a', undefined);
  test.equal(obj[2].a, 'value');
  test.equal(mut[2].a, undefined);

  mut = obj.set(0, undefined);
  test.equal(obj[0], 0);
  test.equal(mut[0], 1);

  mut = mod.toJS();
  test.deepEqual(mut, mod);
  test.equal(constant.isObject(mod[2]), true);
  test.equal(constant.isObject(mut[2]), false);

  obj = obj.set(2, 'other', new Date(0));
  mod = obj.mutate([2, 'other'], 'setFullYear', 2017);
  test.equal(obj[2].other.getFullYear(), 1970);
  test.equal(mod[2].other.getFullYear(), 2017);

  mod = obj.splice(0, 1, { insert: [1, 2, 3] });
  test.equal(constant.isArray(mod), true);
  test.equal(obj.length, mod.length);
  test.notEqual(obj[0], mod[0]);
  test.equal(obj[1], mod[1]);
  test.equal(obj[2], mod[2]);
  test.equal(obj[3], mod[3]);
  test.equal(constant.isObject(mod[0]), true);
  test.equal(constant.isArray(mod[0].insert), true);
  test.deepEqual(mod[0], { insert: [1, 2, 3] });

  mod = obj.concat([4, 5, 6]);
  test.equal(constant.isArray(mod), true);
  test.equal(obj.length + 3, mod.length);
  test.equal(obj[0], mod[0]);
  test.equal(obj[1], mod[1]);
  test.equal(obj[2], mod[2]);
  test.equal(obj[3], mod[3]);
  test.equal(mod[4], 4);
  test.equal(mod[5], 5);
  test.equal(mod[6], 6);

  mod = obj.reverse();
  test.equal(constant.isArray(mod), true);
  test.equal(obj.length, mod.length);
  test.equal(obj[0], mod[3]);
  test.equal(obj[1], mod[2]);
  test.equal(obj[2], mod[1]);
  test.equal(obj[3], mod[0]);

  obj = constant([1, 3, 2, 0, 4, 6, 5]);
  mod = obj.sort();
  test.equal(constant.isArray(mod), true);
  test.deepEqual(mod, [0, 1, 2, 3, 4, 5, 6]);

  mod = obj.sort(function (a, b) { return b - a; });
  test.equal(constant.isArray(mod), true);
  test.deepEqual(mod, [6, 5, 4, 3, 2, 1, 0]);

  obj = constant([1, 3]);
  mod = obj.insert(1, 2);
  test.equal(constant.isArray(mod), true);
  test.equal(obj.length + 1, mod.length);
  test.deepEqual(mod, [1, 2, 3]);

  mod = obj.delete(0);
  test.equal(constant.isArray(mod), true);
  test.equal(obj.length - 1, mod.length);
  test.deepEqual(mod, [3]);

  obj = constant([1, 2, 3]);
  test.equal(obj.last, 3);
  test.equal(obj.first, 1);

  mod = obj.shift();
  test.equal(constant.isArray(mod), true);
  test.equal(obj.length - 1, mod.length);
  test.deepEqual(mod, [2, 3]);

  mod = obj.pop();
  test.equal(constant.isArray(mod), true);
  test.equal(obj.length - 1, mod.length);
  test.deepEqual(mod, [1, 2]);

  mod = obj.unshift(0);
  test.equal(constant.isArray(mod), true);
  test.equal(obj.length + 1, mod.length);
  test.deepEqual(mod, [0, 1, 2, 3]);

  mod = obj.push(4);
  test.equal(constant.isArray(mod), true);
  test.equal(obj.length + 1, mod.length);
  test.deepEqual(mod, [1, 2, 3, 4]);

  obj = constant([0, 1, 2, 3, 4]);
  mod = obj.transform(function (v) { return v * v; });
  test.equal(constant.isArray(mod), true);
  test.deepEqual(mod, [0, 1, 4, 9, 16]);

  mod = obj.transform(function (v) { return v ? v * 2 : undefined });
  test.equal(constant.isArray(mod), true);
  test.deepEqual(mod, [2, 4, 6, 8]);

  obj = constant([1, 2, undefined, null, 5]);
  test.equal(constant.isArray(obj), true);
  test.deepEqual(obj, [1, 2, null, 5]);

  test.end();
});
