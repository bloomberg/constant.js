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
  var av = {};
  var bv = {};
  var cv = {};
  var set = new Set([av, bv]);

  var obj = constant(set);

  test.equal(typeof obj.get, 'function', 'obj.get is a function');
  test.equal(typeof obj.set, 'function', 'obj.set is a function');
  test.equal(typeof obj.toJS, 'function', 'obj.toJS is a function');
  test.equal(typeof obj.mutable, 'function', 'obj.mutable is a function');
  test.equal(typeof obj.mutate, 'function', 'obj.mutate is a function');
  test.equal(typeof obj.add, 'function', 'obj.add is a function');
  test.equal(typeof obj.clear, 'function', 'obj.clear is a function');
  test.equal(typeof obj.delete, 'function', 'obj.delete is a function');

  test.equal(constant.isSet(obj), true);
  test.equal(obj === set, true);

  test.equal(obj.get(0) === av, true);
  test.equal(obj.get(1) === bv, true);
  test.equal(constant.is(obj.get(0)), true);
  test.equal(constant.is(obj.get(1)), true);

  var chg = obj.add(cv);
  test.equal(obj.size, 2);
  test.equal(chg.size, 3);
  test.equal(constant.isSet(chg), true);
  test.equal(chg.get(0) === av, true);
  test.equal(chg.get(1) === bv, true);
  test.equal(chg.get(2) === cv, true);
  test.equal(constant.is(chg.get(0)), true);
  test.equal(constant.is(chg.get(1)), true);
  test.equal(constant.is(chg.get(2)), true);

  chg = obj.clear();
  test.equal(obj.size, 2);
  test.equal(chg.size, 0);
  test.equal(constant.isSet(chg), true);

  chg = obj.delete(av);
  test.equal(obj.size, 2);
  test.equal(chg.size, 1);
  test.equal(constant.isSet(chg), true);
  test.equal(chg.get(0) === bv, true);
  test.equal(constant.is(chg.get(0)), true);
  test.equal(chg.get(50), undefined);

  chg = obj.add(av);
  test.equal(chg === obj, true);

  chg = obj.delete(cv);
  test.equal(chg === obj, true);

  obj = constant(new Set());
  chg = obj.clear();
  test.equal(obj === chg, true);

  test.end();
});
