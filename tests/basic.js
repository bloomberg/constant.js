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
var util = require('../lib/util.js');

tap.test('basic object', function (test) {
    'use strict';
    var o = { a: 1, b: 2, c: 2, z: undefined };
    test.equal(2, o.c);
    o.c = 3;
    test.equal(3, o.c);
    test.equal(o.hasOwnProperty('z'), true);
    var x = constant(o);
    test.assert(o === x);
    test.throws(function () { o.d = 4; });
    test.throws(function () { o.c = 5; });
    test.equal(o.c, 3);
    test.equal(x.hasOwnProperty('z'), false);
    test.equal(1, o.get('a'));
    test.equal(2, o.get('b'));
    test.equal(3, o.get('c'));
    test.assert(constant.is(o));
    test.assert(constant.isObject(o));
    test.assert(!constant.isArray(o));
    test.assert(!constant.isDate(o));
    test.end();
});

tap.test('basic array', function (test) {
    var a = [1, 2, 2];
    test.equal(2, a[2]);
    a[2] = 3;
    test.equal(3, a[2]);
    var x = constant(a);
    test.assert(a === x);
    test.throws(function () { a[3] = 4; });
    test.equal(a[3], undefined);
    test.throws(function () { a[2] = 5; });
    test.equal(a[2], 3);
    test.equal(1, a.get(0));
    test.equal(2, a.get(1));
    test.equal(3, a.get(2));
    test.assert(constant.is(a));
    test.assert(!constant.isObject(a));
    test.assert(constant.isArray(a));
    test.assert(!constant.isDate(a));
    test.end();
});

tap.test('basic date', function (test) {
    var a = new Date(0);
    test.equal(1970, a.getFullYear());
    a.setFullYear(1900);
    test.equal(1900, a.getFullYear());
    var x = constant(a);
    test.assert(a === x);
    var y = x.setFullYear(2017);
    test.assert(y !== x);
    test.equal(x.getFullYear(), 1900);
    test.equal(y.getFullYear(), 2017);

    test.throws(function () { x.prop = true; });

    test.assert(constant.is(a));
    test.assert(!constant.isObject(a));
    test.assert(!constant.isArray(a));
    test.assert(constant.isDate(a));
    test.end();
});

tap.test('assign', function (test) {
    var a = {};
    var b = { a: 1, b: 2, c: undefined };
    var c = util.assign(a, b);
    test.assert(a === c);
    test.deepEqual(Object.keys(a), ['a', 'b']);
    test.equal(a.a, 1);
    test.equal(a.b, 2);
    test.equal(typeof b.c, 'undefined');
    test.equal(b.hasOwnProperty('c'), true);
    test.equal(a.hasOwnProperty('c'), false);

    test.end();
});
