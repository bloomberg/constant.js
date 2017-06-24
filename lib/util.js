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

var constant = require('./constant.js');
var COPY = require('./copy.js').COPY;

exports.mutableValue = function mutableValue(value) {
    var map = this && this.map;
    return (value && ('function' === typeof value.toJS)) ? value.toJS(map) : value;
};
exports.constantProp = function constantProp(prop) {
    if (undefined === this[prop]) {
        delete this[prop];
    } else {
        this[prop] = constant(this[prop]);
    }
};
exports.copyProp = function copyProp(prop) {
    var value = (this.mapper || exports.identity).call(this, this.source[prop]);
    if (undefined !== value) {
        this.target[prop] = value;
    }
};
exports.assign = function assign(target, source, mapper, map) {
    Object.keys(source).forEach(exports.copyProp, { target: target, source: source, mapper: mapper, map: map });
    return target;
};
exports.hideProp = function hideProp(prop) {
    var desc = Object.getOwnPropertyDescriptor(this, prop);
    desc.enumerable = false;
    Object.defineProperty(this, prop, desc);
};

var DATE_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})(?:\.(\d{3}))?Z$/;
exports.dateReviver = function dateReviver(key, val) {
    var match;
    if ('string' === typeof val) {
        if ((match = DATE_RE.exec(val))) {
            val = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3], +match[4], +match[5], +match[6], +match[7]));
        }
    }
    return val;
};
exports.identity = function identity(v) { return v; };

exports.setCopy = function setCopy(obj, fn) {
    Object.defineProperty(obj, COPY, {
        value: fn,
        enumerable: false,
        writable: true,
        configurable: true
    });
};
exports.clearArrayUndefined = function clearArrayUndefined(obj) {
    for (var idx = obj.length; idx >= 0; idx--) {
        if (obj[idx] === undefined) {
            obj.splice(idx, 1);
        }
    }
};

exports.getOwnPropertyDescriptors = function(obj) {
    var desc = {};
    Object.getOwnPropertyNames(obj).forEach(copyDescriptor, { source: obj, target: desc});
    return desc;
};
function copyDescriptor(name) {
    var desc = Object.getOwnPropertyDescriptor(this.source, name);
    this.target[name] = desc;
}
