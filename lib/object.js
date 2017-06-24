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

module.exports = object;
var constant = require('./constant.js');

var util = require('./util.js');

function object() {
    var cpy = util.assign(Object.create(Object.getPrototypeOf(this)), this);
    util.setCopy(cpy, object);
    return cpy;
}
object.proto = {};
object.proto.assign = function () {
    var args = [ this.mutable() ];
    args.push.apply(args, arguments);
    return constant(Object.assign.apply(Object, args));
};
object.proto.transform = function (fn, tp) {
    var changed = false;
    var result = {};
    var keys = Object.keys(this);
    for (var idx = 0, len = keys.length; idx < len; idx++) {
        var newval = fn.call(tp || null, this[keys[idx]], keys[idx], this);
        if (newval !== this[keys[idx]]) {
            result[keys[idx]] = newval;
            changed = true;
        }
    }
    if (!changed) { return this; }
    return this.assign(result);
};
Object.keys(object.proto).forEach(util.hideProp, object.proto);
