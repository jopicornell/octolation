'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = spreadsheetToLanguages;
function convertIdToMap(translationMap, id, value) {
  var obj = translationMap;
  var splittedId = id.split('.');
  for (var i = 0; i < splittedId.length - 1; i += 1) {
    if (!obj[splittedId[i]]) {
      obj[splittedId[i]] = {};
    }
    obj = obj[splittedId[i]];
  }
  obj[splittedId[splittedId.length - 1]] = value;
}

function spreadsheetToLanguages(rows) {
  var header = rows[0];
  var languagesMap = {};
  var languagesAux = {};
  for (var column = 1; column < header.length; column += 1) {
    languagesAux[header[column]] = column;
    languagesMap[header[column]] = {};
  }
  rows.shift();
  Object.keys(languagesAux).forEach(function (lang) {
    var index = languagesAux[lang];
    rows.forEach(function (row) {
      if (row[0]) {
        convertIdToMap(languagesMap[lang], row[0], row[index]);
      }
    });
  });
  return languagesMap;
}