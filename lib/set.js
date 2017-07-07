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

module.exports = set;

var constant = require('./constant.js');
var util = require('./util.js');

function set() {
  var cpy = new Set();
  this.forEach(copyItem, cpy);
  return cpy;
}
set.proto = {};
set.proto.clear = function clear() {
  if (!this.size) { return this; }
  return constant(new Set());
};
set.proto.delete = function remove(val) {
  if (!this.has(val)) { return this; }
  var mutable = this.mutable();
  mutable.delete.apply(mutable, arguments);
  return constant(mutable);
};
set.proto.get = function get(idx) {
  if (idx < 0 || idx > (this.size - 1)) { return; }
  var iter = this.values();
  var item = iter.next();
  while (idx) {
    item = iter.next();
    idx--;
  }
  return item.value;
}
set.proto.add = function add(val) {
  if (this.has(val)) { return this; }
  var mutable = this.mutable();
  Set.prototype.add.apply(mutable, arguments);
  return constant(mutable);
};

Object.keys(set.proto).forEach(util.hideProp, set.proto);

function copyItem(val) {
  this.add(val);
}
