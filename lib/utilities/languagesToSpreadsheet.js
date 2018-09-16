'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = languagesToSpreadsheet;

var _plainObject = require('./plainObject');

var _plainObject2 = _interopRequireDefault(_plainObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function languagesToSpreadsheet(languagesMap) {
  var plainedObject = {};
  Object.keys(languagesMap).forEach(function (lang) {
    var plain = (0, _plainObject2.default)(languagesMap[lang]);
    Object.keys(plain).forEach(function (key) {
      if (plainedObject[key]) {
        plainedObject[key].push(plain[key]);
      } else {
        plainedObject[key] = [plain[key]];
      }
    });
  });
  var spreadsheetArray = Object.keys(plainedObject).map(function (key) {
    return [key].concat(_toConsumableArray(plainedObject[key]));
  });
  console.log(JSON.stringify(spreadsheetArray));
  spreadsheetArray.unshift(['code'].concat(_toConsumableArray(Object.keys(languagesMap))));
  return spreadsheetArray;
}