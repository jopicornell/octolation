'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = translationImport;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _flat = require('flat');

var _javascriptStringify = require('javascript-stringify');

var _javascriptStringify2 = _interopRequireDefault(_javascriptStringify);

var _GoogleSpreadsheet = require('./GoogleSpreadsheet');

var _GoogleSpreadsheet2 = _interopRequireDefault(_GoogleSpreadsheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var splitLanguages = function splitLanguages(data) {
  var languagesMap = {};
  var languagesList = data[0].slice(1); // array with langs, first column is "code"
  languagesList.forEach(function (lang, index) {
    languagesMap[lang] = (0, _flat.unflatten)(data.slice(1).reduce(function (before, after) {
      var row = before;
      row[after[0]] = after[index + 1];
      return row;
    }, {}));
  });
  return languagesMap;
};

function translationImport(clientId, secret, spreadsheetId) {
  var sheet = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Translations';
  var folder = arguments[4];

  var googleSpreadsheet = new _GoogleSpreadsheet2.default(secret, clientId);
  return googleSpreadsheet.authorize().then(function () {
    return _fsExtra2.default.mkdir('.' + folder + '/langs').catch(function (err) {
      if (err.code === 'EEXIST') {
        return Promise.resolve();
      }
      return Promise.reject(err);
    });
  }).then(function () {
    return googleSpreadsheet.readSpreadsheet(spreadsheetId, sheet + '!A1:C');
  }).then(function (spreadsheetData) {
    var languagesMap = splitLanguages(spreadsheetData.values);
    return Promise.all(Object.keys(languagesMap).map(function (lang) {
      var contentTranslation = (0, _javascriptStringify2.default)(languagesMap[lang], null, 2);
      contentTranslation = 'module.exports = ' + contentTranslation;
      return _fsExtra2.default.writeFile('.' + folder + '/langs/' + lang + '.js', contentTranslation);
    }));
  }).catch(function (err) {
    return console.error(err);
  });
}