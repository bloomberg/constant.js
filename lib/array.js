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

module.exports = array;

var constant = require('./constant.js');
var util = require('./util.js');

function array() {
    var cpy = util.assign(this.slice(), this);
    util.setCopy(cpy, array);
    return cpy;
}
array.proto = {};
array.proto.splice = function () {
    var mutable = this.mutable();
    Array.prototype.splice.apply(mutable, arguments)
    return constant(mutable);
};
array.proto.concat = function () {
    return constant(Array.prototype.concat.apply(this.mutable(), arguments));
};
array.proto.reverse = function () {
    return constant(Array.prototype.reverse.apply(this.mutable(), arguments));
};
array.proto.sort = function () {
    return constant(Array.prototype.sort.apply(this.mutable(), arguments));
};
array.proto.insert = function (idx, value) {
    return this.splice(idx, 0, value);
};
array.proto.delete = function (idx) {
    return this.splice(idx, 1);
};
array.proto.transform = function (fn, tp) {
    var changed = false;
    var result = [];
    for (var idx = 0, len = this.length; idx < len; idx++) {
        var newval = fn.call(tp || null, this[idx], idx, this);
        if (newval === undefined) {
            changed = true;
        } else {
            changed = changed || (newval !== this[idx]);
            result.push(newval);
        }
    }
    if (!changed) { return this; }
    return constant(result);
};
Object.defineProperties(array.proto, {
    first: {
        get: function () { return this[0]; },
        configurable: true
    },
    last: {
        get: function () { return this[this.length - 1]; },
        configurable: true
    }
});
array.proto.shift = function () {
    return this.delete(0);
};
array.proto.unshift = function () {
    var args = [];
    args.push.apply(args, arguments);
    args.unshift(0, 0);
    return this.insert.apply(this, args);
};
array.proto.pop = function () {
    return this.delete(this.length - 1);
};
array.proto.push = function (value) {
    var args = [];
    args.push.apply(args, arguments);
    args.unshift(this.length, 0);
    return this.splice.apply(this, args);
};
Object.keys(array.proto).forEach(util.hideProp, array.proto);
