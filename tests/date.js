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

tap.test('date', function (test) {
  var obj = constant(new Date(0));

  test.equal(typeof obj.get, 'function', 'obj.get is a function');
  test.equal(typeof obj.set, 'function', 'obj.set is a function');
  test.equal(typeof obj.toJS, 'function', 'obj.toJS is a function');
  test.equal(typeof obj.mutable, 'function', 'obj.mutable is a function');
  test.equal(typeof obj.mutate, 'function', 'obj.mutate is a function');

  var mod = obj.set('a', { item: 'test' });
  test.equal(obj.get('a'), undefined);
  test.deepEqual(mod.get('a'), { item: 'test' });
  test.equal(constant.isObject(mod.a), true);

  var mut = mod.mutable();
  test.equal(constant.isDate(mod), true);
  test.equal(constant.isDate(mut), false);
  test.equal(constant.isObject(mod.a), true);
  test.equal(constant.isObject(mut.a), true);
  test.deepEqual(mut, mod);

  mut = mod.toJS();
  test.deepEqual(mut, mod);
  test.equal(constant.isObject(mod.a), true);
  test.equal(constant.isObject(mut.a), false);

  obj = obj.set('a', [1, 2, 3]);
  mod = obj.mutate(['a'], 'push', 4);
  test.deepEqual(obj.a, [1, 2, 3]);
  test.deepEqual(mod.a, [1, 2, 3, 4]);

  obj = constant(new Date(0));

  mod = obj.setDate(2);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getDate(), 2);

  mod = obj.setFullYear(2017);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getFullYear(), 2017);

  mod = obj.setHours(15);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getHours(), 15);

  mod = obj.setMilliseconds(456);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getMilliseconds(), 456);

  mod = obj.setMinutes(45);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getMinutes(), 45);

  mod = obj.setMonth(5);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getMonth(), 5);

  mod = obj.setSeconds(15);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getSeconds(), 15);

  mod = obj.setTime(1234567);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getTime(), 1234567);

  mod = obj.setUTCDate(2);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getUTCDate(), 2);

  mod = obj.setUTCFullYear(2017);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getUTCFullYear(), 2017);

  mod = obj.setUTCHours(15);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getUTCHours(), 15);

  mod = obj.setUTCMilliseconds(456);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getUTCMilliseconds(), 456);

  mod = obj.setUTCMinutes(45);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getUTCMinutes(), 45);

  mod = obj.setUTCMonth(5);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getUTCMonth(), 5);

  mod = obj.setUTCSeconds(15);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getUTCSeconds(), 15);

  mod = obj.setYear(99);
  test.equal(constant.isDate(mod), true);
  test.equal(mod.getYear(), 99);

  test.end();
});
