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

var tap = require('tap');
var constant = require('../');

tap.test('shared tree optimization (set)', function (test) {
    var obj = constant({ a: { b: { c: 'test' }, d: { e: 'test' } } });

    var mut = obj.set('a', 'b', 'c', 'hello');
    test.equal(mut.a.b.c, 'hello');
    test.assert(mut.a.b.c !== obj.a.b.c);
    test.equal(mut.a.d.e, 'test');
    test.assert(mut.a.d.e === obj.a.d.e);

    var mut = obj.set('a', 'b', 'c', 'test');
    test.equal(mut.a.b.c, 'test');
    test.assert(mut.a.b.c === obj.a.b.c);
    test.equal(mut.a.d.e, 'test');
    test.assert(mut.a.d.e === obj.a.d.e);

    test.end();
});

tap.test('shared tree (mutate)', function (test) {
    var obj = constant({ a: { b: { c: 'test' }, d: { e: new Date(0) } } });

    var mut = obj.mutate(['a', 'd', 'e'], 'setTime', 1234567);
    test.equal(mut.a.d.e.getTime(), 1234567);
    test.assert(mut.a.d.e !== obj.a.d.e);
    test.equal(mut.a.b.c, 'test');
    test.assert(mut.a.b.c === obj.a.b.c);

    var mut = obj.mutate(['a', 'd', 'e'], 'setTime', 0);
    test.equal(mut.a.d.e.getTime(), 0);
    test.assert(mut.a.d.e === obj.a.d.e);
    test.equal(mut.a.b.c, 'test');
    test.assert(mut.a.b.c === obj.a.b.c);

    test.end();
});

tap.test('date identical optimization', function (test) {
    obj = constant(new Date());

    mod = obj.setDate(obj.getDate());
    test.assert(mod === obj);

    mod = obj.setFullYear(obj.getFullYear());
    test.assert(mod === obj);

    mod = obj.setHours(obj.getHours());
    test.assert(mod === obj);

    mod = obj.setMilliseconds(obj.getMilliseconds());
    test.assert(mod === obj);

    mod = obj.setMinutes(obj.getMinutes());
    test.assert(mod === obj);

    mod = obj.setMonth(obj.getMonth());
    test.assert(mod === obj);

    mod = obj.setSeconds(obj.getSeconds());
    test.assert(mod === obj);

    mod = obj.setTime(obj.getTime());
    test.assert(mod === obj);

    mod = obj.setUTCDate(mod.getUTCDate());
    test.assert(mod === obj);

    mod = obj.setUTCFullYear(obj.getUTCFullYear());
    test.assert(mod === obj);

    mod = obj.setUTCHours(obj.getUTCHours());
    test.assert(mod === obj);

    mod = obj.setUTCMilliseconds(obj.getUTCMilliseconds());
    test.assert(mod === obj);

    mod = obj.setUTCMinutes(obj.getUTCMinutes());
    test.assert(mod === obj);

    mod = obj.setUTCMonth(obj.getUTCMonth());
    test.assert(mod === obj);

    mod = obj.setUTCSeconds(mod.getUTCSeconds());
    test.assert(mod === obj);

    mod = obj.setYear(obj.getYear());
    test.assert(mod === obj);

    obj = obj.setFullYear(1999);
    mod = obj.setYear(99);
    test.assert(mod === obj);

    obj = obj.setFullYear(3999);
    mod = obj.setYear(3999);
    test.equal(mod.getFullYear(3999), 3999);
    test.assert(mod === obj);

    test.end();
});

tap.test('array identical transform', function (test) {
    var arr = constant([1, 2, 3, 4, 5]);
    var mod = arr.transform(function (v) { return v; });
    test.equal(constant.isArray(mod), true);
    test.assert(arr === mod);

    test.end();
});
