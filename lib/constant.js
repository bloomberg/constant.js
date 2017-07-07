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

module.exports = constant;

var util = require('./util.js');
var COPY = require('./copy.js').COPY;

var common = require('./common.js');
var array = require('./array.js');
var object = require('./object.js');
var date = require('./date.js');
var map = require('./map.js');

function constant(obj) {
    if (!obj || ('object' !== typeof obj) || constant.is(obj)) { return obj; }
    if (obj.mutable === common.mutable) { return obj; }
    var copy = obj[COPY];
    if (!copy) {
        switch (true) {
            case (Array.isArray(obj)):
                copy = array;
                break;
            case (obj instanceof Date):
                copy = date;
                break;
            case (obj instanceof RegExp):
                return Object.freeze(obj);
            case ('function' === typeof Map) && !Map._____ignore && (obj instanceof Map):
                copy = map;
                break;
            case ('function' === typeof Promise) && (obj instanceof Promise):
                return Object.freeze(obj);
            default:
                copy = object;
        }
    }
    util.setCopy(obj, copy);
    Object.defineProperties(obj, util.getOwnPropertyDescriptors(common));
    if (('function' === typeof Symbol) && !Symbol._____ignore && Symbol.iterator && ('function' === typeof obj[Symbol.iterator])) {
        var iter = obj[Symbol.iterator]();
        var item;
        while ((item = iter.next()) && !item.done) {
            constant(item.value);
        }
    } else {
        Object.keys(obj).forEach(util.constantProp, obj);
    }
    if (copy === array) {
        util.clearArrayUndefined(obj);
    }
    Object.defineProperties(obj, util.getOwnPropertyDescriptors(copy.proto));
    util.setCopy(obj, copy);
    return Object.freeze(obj);
}
constant.COPY = COPY;
constant.parse = function (str) {
    return constant(JSON.parse(str, util.dateReviver));
};
constant.is = function is(obj) {
    return !!(obj && obj[COPY] && Object.isFrozen(obj));
};
constant.isArray = function isArray(obj) {
    return !!(obj && (obj[COPY] === array) && Object.isFrozen(obj));
};
constant.isObject = function isObject(obj) {
    return !!(obj && (obj[COPY] === object) && Object.isFrozen(obj));
};
constant.isDate = function isDate(obj) {
    return !!(obj && (obj[COPY] === date) && Object.isFrozen(obj));
};
constant.isMap = function isMap(obj) {
    return !!(obj && (obj[COPY] === map) && Object.isFrozen(obj));
};
