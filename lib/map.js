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

module.exports = map;

var constant = require('./constant.js');
var util = require('./util.js');

function map() {
  var cpy = new Map();
  this.forEach(copyItem, cpy);
  return cpy;
}
map.proto = {};
map.proto.clear = function clear() {
  if (!this.size) { return this; }
  return constant(new Map());
};
map.proto.delete = function remove(key) {
  if (!this.has(key)) { return this; }
  var mutable = this.mutable();
  mutable.delete.apply(mutable, arguments);
  return constant(mutable);
};
map.proto.get = function get() {
  return Map.prototype.get.apply(this, arguments);
}
map.proto.set = function set(key, val) {
  if (this.get(key) === val) { return this; }
  var mutable = this.mutable();
  Map.prototype.set.apply(mutable, arguments);
  return constant(mutable);
};

Object.keys(map.proto).forEach(util.hideProp, map.proto);

function copyItem(val, key) {
  this.set(key, val);
}
