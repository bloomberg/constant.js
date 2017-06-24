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

module.exports = date;

var constant = require('./constant.js');
var util = require('./util.js');

function date() {
    var cpy = util.assign(new Date(this.getTime()), this);
    util.setCopy(cpy, date);
    return cpy;
}
date.proto = {};
date.proto.setDate = function () {
    var obj = this.mutable();
    Date.prototype.setDate.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setFullYear = function () {
    var obj = this.mutable();
    Date.prototype.setFullYear.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setHours = function () {
    var obj = this.mutable();
    Date.prototype.setHours.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setMilliseconds = function () {
    var obj = this.mutable();
    Date.prototype.setMilliseconds.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setMinutes = function () {
    var obj = this.mutable();
    Date.prototype.setMinutes.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setMonth = function () {
    var obj = this.mutable();
    Date.prototype.setMonth.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setSeconds = function () {
    var obj = this.mutable();
    Date.prototype.setSeconds.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setTime = function () {
    var obj = this.mutable();
    Date.prototype.setTime.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setUTCDate = function () {
    var obj = this.mutable();
    Date.prototype.setUTCDate.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setUTCFullYear = function () {
    var obj = this.mutable();
    Date.prototype.setUTCFullYear.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setUTCHours = function () {
    var obj = this.mutable();
    Date.prototype.setUTCHours.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setUTCMilliseconds = function () {
    var obj = this.mutable();
    Date.prototype.setUTCMilliseconds.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setUTCMinutes = function () {
    var obj = this.mutable();
    Date.prototype.setUTCMinutes.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setUTCMonth = function () {
    var obj = this.mutable();
    Date.prototype.setUTCMonth.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setUTCSeconds = function () {
    var obj = this.mutable();
    Date.prototype.setUTCSeconds.apply(obj, arguments);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
date.proto.setYear = function (val) {
    val = (val < 500) ? (val + 1900) : val;
    var obj = this.mutable();
    Date.prototype.setFullYear.call(obj, val);
    return obj.valueOf() === this.valueOf() ? this : constant(obj);
};
Object.keys(date.proto).forEach(util.hideProp, date.proto);
