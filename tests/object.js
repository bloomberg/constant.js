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

tap.test('object', function (test) {
  var obj = constant({ a: 'test', b: { c: true } });

  test.equal(typeof obj.get, 'function', 'obj.get is a function');
  test.equal(typeof obj.set, 'function', 'obj.set is a function');
  test.equal(typeof obj.toJS, 'function', 'obj.toJS is a function');
  test.equal(typeof obj.mutable, 'function', 'obj.mutable is a function');
  test.equal(typeof obj.mutate, 'function', 'obj.mutate is a function');

  var mut = obj.mutable();
  test.equal(constant.isObject(obj), true);
  test.equal(constant.isObject(mut), false);
  test.equal(constant.isObject(obj.b), true);
  test.equal(constant.isObject(mut.b), true);
  test.deepEqual(mut, obj);

  test.equal(obj.get('a'), 'test');

  var mod = obj.set('a', 'modified');
  test.equal(obj.a, 'test');
  test.equal(mod.a, 'modified');

  mod = obj.set('a', { other: 'modification' });
  test.equal(obj.a, 'test');
  test.deepEqual(mod.a, { other: 'modification' });
  test.equal(constant.isObject(mod.a), true);

  obj = mod.set('a', 'other', new Date(0));
  test.equal(mod.get('a', 'other'), 'modification');
  test.equal(obj.get('a', 'other').getFullYear(), 1970);

  mut = mod.toJS();
  test.deepEqual(mut, mod);
  test.equal(constant.isObject(mod.a), true);
  test.equal(constant.isObject(mut.a), false);

  mod = obj.mutate(['a', 'other'], 'setFullYear', 2017);
  test.equal(obj.a.other.getFullYear(), 1970);
  test.equal(mod.a.other.getFullYear(), 2017);

  test.throws(function () { obj.mutate('a', 'other', 'setFullYear', 2017); });
  test.throws(function () { obj.mutate(['a', 'other'], 1234, 2017); });

  mut = { a: 'hallo', d: { e: 5 } };
  mod = obj.assign(mut);
  test.equal(constant.isObject(mod), true);
  test.equal(constant.isObject(mod.d), true);
  test.deepEqual(mod, { a: 'hallo', b: obj.b, d: mut.d });
  test.equal(obj.b === mod.b, true);

  mut = obj.transform(function(val, key) {
    return val;
  });
  test.equal(mut === obj, true);

  obj = constant({ a: 1, b: 2, c: 3, d: 4, e: 5 });
  mut = obj.transform(function(val, key) {
    return key === 'b' ? undefined : (val * 2);
  });
  test.equal(constant.isObject(mut), true);
  test.deepEqual(mut, { a: 2, c: 6, d: 8, e: 10 });

  test.end();
});
