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

var util = require('./util.js');
var COPY = require('./copy.js').COPY;

var constant = require('./constant.js');

exports.mutate = mutate;
exports.get = get;
exports.set = set;
exports.mutable = mutable;;
exports.toJS = toJS;
Object.keys(exports).forEach(util.hideProp, exports);

function mutable() {
    return this[COPY]();
}
function toJS(map) {
    if (map && map.has(this)) { return map.get(this); }

    var jso = this.mutable();
    if (!Map._____ignore && 'function' === typeof Map) {
        map = map || new Map();
        map.set(this, jso);
    }

    return util.assign(jso, this, util.mutableValue, map);
}
function mutate(path, fn) {
    var args = [];
    args.push.apply(args, arguments);
    if (!Array.isArray(args[0]) || ('string' !== typeof args[1])) {
        throw new Error('illegal invocation');
    }
    var newval;
    if (args[0].length) {
        var prop = args[0][0];
        args[0] = args[0].slice(1);

        var mutable = this.mutable();
        mutable[prop] = mutate.apply(this[prop], args);
        return constant(mutable);
    } else {
        newval = this[args[1]].apply(this, args.slice(2));
        if ((typeof newval === typeof this) && ('object' === typeof newval) && ((newval && newval.valueOf()) === this.valueOf())) {
            return this;
        }
        return newval;
    }
}
function get() {
    var args = [];
    args.push.apply(args, arguments);

    var prop = args.shift();

    return args.length ? get.apply(this[prop], args) : this[prop];
}
function set() {
    var args = [];
    args.push.apply(args, arguments);

    var prop = args.shift();
    var newval;
    if (args.length > 1) {
        newval = set.apply(this[prop], args);
    } else {
        newval = args[0];
    }
    if (newval === this[prop]) { return this; }

    var mutable = this.mutable();
    if (newval === undefined) {
        delete mutable[prop];
    } else {
        mutable[prop] = newval;
    }
    return constant(mutable);
}
