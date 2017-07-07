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
  var ak = {}, av = {};
  var bk = {}, bv = {};
  var ck = {}, cv = {};
  var map = new Map();
  map.set(ak, av);
  map.set(bk, bv);

  var obj = constant(map);

  test.equal(typeof obj.get, 'function', 'obj.get is a function');
  test.equal(typeof obj.set, 'function', 'obj.set is a function');
  test.equal(typeof obj.toJS, 'function', 'obj.toJS is a function');
  test.equal(typeof obj.mutable, 'function', 'obj.mutable is a function');
  test.equal(typeof obj.mutate, 'function', 'obj.mutate is a function');
  test.equal(typeof obj.clear, 'function', 'obj.clear is a function');
  test.equal(typeof obj.delete, 'function', 'obj.delete is a function');

  test.equal(constant.isMap(obj), true);
  test.equal(obj === map, true);

  test.equal(obj.get(ak) === av, true);
  test.equal(obj.get(bk) === bv, true);
  test.equal(constant.is(obj.get(ak)), true);
  test.equal(constant.is(obj.get(bk)), true);

  var chg = obj.set(ck, cv);
  test.equal(obj.size, 2);
  test.equal(chg.size, 3);
  test.equal(constant.isMap(chg), true);
  test.equal(chg.get(ak) === av, true);
  test.equal(chg.get(bk) === bv, true);
  test.equal(chg.get(ck) === cv, true);
  test.equal(constant.is(chg.get(ak)), true);
  test.equal(constant.is(chg.get(bk)), true);
  test.equal(constant.is(chg.get(ck)), true);

  chg = obj.clear();
  test.equal(obj.size, 2);
  test.equal(chg.size, 0);
  test.equal(constant.isMap(chg), true);

  chg = obj.delete(ak);
  test.equal(obj.size, 2);
  test.equal(chg.size, 1);
  test.equal(constant.isMap(chg), true);
  test.equal(chg.get(bk) === bv, true);
  test.equal(constant.is(chg.get(bk)), true);

  chg = obj.delete(ck);
  test.equal(chg === obj, true);

  chg = obj.set(ak, av);
  test.equal(chg === obj, true);

  obj = constant(new Map());
  chg = obj.clear();
  test.equal(chg === obj, true);

  test.end();
});
