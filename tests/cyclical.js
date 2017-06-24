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

tap.test('cyclical', function (test) {
    var obj = { a: 'hallo' };
    obj.b = obj;

    var cnst = constant(obj);
    test.equal(constant.isObject(cnst), true);

    var mut = obj.toJS();
    test.deepEqual(cnst, mut);
    test.equal(mut === mut.b, true);

    test.end();
});
