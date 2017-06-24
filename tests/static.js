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

tap.test('static', function (test) {
    test.equal(typeof constant, 'function', 'constant is a function');
    test.equal(typeof constant.is, 'function', 'constant.is is a function');
    test.equal(constant.is(test), false, 'the test parameter is not immutable');
    test.equal(typeof constant.isArray, 'function', 'constant.isArray is a function');
    test.equal(typeof constant.isObject, 'function', 'constant.isObject is a function');
    test.equal(typeof constant.isDate, 'function', 'constant.isDate is a function');
    test.equal(typeof constant.parse, 'function', 'constant.parse is a function');

    var obj = { a: '1' };

    var cpy = constant.parse(JSON.stringify(obj));
    test.equal(constant.isObject(obj), false, 'constant.isObject(obj) is false');
    test.equal(constant.isObject(cpy), true, 'constant.isObject(cpy) is true');
    test.deepEqual(obj, cpy, 'they are deepEqual');
    test.equal(constant.isArray(cpy), false, 'constant.isArray(cpy) is false');
    test.equal(constant.isDate(cpy), false, 'constant.isDate(cpy) is false');

    var arr = [1, 2, 3];
    test.equal(constant.is(arr), false, 'constant.is(arr) is false');
    test.equal(constant.isObject(arr), false, 'constant.isObject(arr) is false');
    test.equal(constant.isArray(arr), false, 'constant.isArray(arr) is false');
    test.equal(constant.isDate(arr), false, 'constant.isDate(arr) is false');
    constant(arr);
    test.equal(constant.is(arr), true, 'constant.is(arr) is true');
    test.equal(constant.isObject(arr), false, 'constant.isObject(arr) is false');
    test.equal(constant.isArray(arr), true, 'constant.isArray(arr) is true');
    test.equal(constant.isDate(arr), false, 'constant.isDate(arr) is false');

    var dat = new Date();
    test.equal(constant.is(dat), false, 'constant.is(dat) is false');
    test.equal(constant.isObject(dat), false, 'constant.isObject(dat) is false');
    test.equal(constant.isArray(dat), false, 'constant.isArray(dat) is false');
    test.equal(constant.isDate(dat), false, 'constant.isDate(dat) is false');
    constant(dat);
    test.equal(constant.is(dat), true, 'constant.is(dat) is true');
    test.equal(constant.isObject(dat), false, 'constant.isObject(dat) is false');
    test.equal(constant.isArray(dat), false, 'constant.isArray(dat) is false');
    test.equal(constant.isDate(dat), true, 'constant.isDate(dat) is true');

    var parsed = constant.parse('{"a":"test"}');
    test.equal(constant.is(parsed), true, 'constant.is(parsed) is true');
    test.equal(constant.isObject(parsed), true, 'constant.isObject(parsed) is true');
    test.equal(constant.isArray(parsed), false, 'constant.isArray(parsed) is false');
    test.equal(constant.isDate(parsed), false, 'constant.isDate(parsed) is false');
    test.equal(parsed.a, 'test');

    parsed = constant.parse('[1,2,3]');
    test.equal(constant.is(parsed), true, 'constant.is(parsed) is true');
    test.equal(constant.isObject(parsed), false, 'constant.isObject(parsed) is false');
    test.equal(constant.isArray(parsed), true, 'constant.isArray(parsed) is true');
    test.equal(constant.isDate(parsed), false, 'constant.isDate(parsed) is false');
    test.equal(parsed[2], 3);

    parsed = constant.parse('"2017-06-23T19:15:53.243Z"');
    test.equal(constant.is(parsed), true, 'constant.is(parsed) is true');
    test.equal(constant.isObject(parsed), false, 'constant.isObject(parsed) is false');
    test.equal(constant.isArray(parsed), false, 'constant.isArray(parsed) is false');
    test.equal(constant.isDate(parsed), true, 'constant.isDate(parsed) is true');
    test.equal(parsed.getMonth(), 5);

    var a = { d: new Date(), s: 'test' };
    var b = constant.parse(JSON.stringify(a));
    test.equal(constant.isObject(b), true);
    test.equal(constant.isDate(b.d), true);
    test.equal(a.d.valueOf(), b.d.valueOf());
    test.equal(a.s, 'test');
    test.equal(a.s, b.s);

    test.end();
});
