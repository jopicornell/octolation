'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = plainObject;
function plainObject(object, pathParam) {
  var path = '';
  if (pathParam) {
    path = pathParam;
  }
  return Object.keys(object).reduce(function (prev, next) {
    if (_typeof(object[next]) !== 'object' || Array.isArray(object[next])) {
      prev[path + next] = object[next]; // eslint-disable-line no-param-reassign
      return prev;
    }
    var plainObj = plainObject(object[next], '' + path + next + '.');
    Object.keys(plainObj).forEach(function (key) {
      prev[key] = plainObj[key]; // eslint-disable-line no-param-reassign
    });
    return prev;
  }, {});
}