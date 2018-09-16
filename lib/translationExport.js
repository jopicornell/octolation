'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = translationExport;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _GoogleSpreadsheet = require('./GoogleSpreadsheet');

var _GoogleSpreadsheet2 = _interopRequireDefault(_GoogleSpreadsheet);

var _languagesToSpreadsheet = require('./utilities/languagesToSpreadsheet');

var _languagesToSpreadsheet2 = _interopRequireDefault(_languagesToSpreadsheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function translationExport(clientId, secret, spreadsheetId) {
  var sheet = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Translations';
  var folder = arguments[4];

  var googleSpreadsheet = new _GoogleSpreadsheet2.default(secret, clientId);
  var languagesMap = {};
  return _fsExtra2.default.readdir('.' + folder + '/langs/').then(function (files) {
    return Promise.all(files.map(function (file) {
      return _fsExtra2.default.readFile('.' + folder + '/langs/' + file, 'utf8').then(function (content) {
        var sandbox = {
          module: {
            export: {}
          }
        };
        _vm2.default.runInNewContext(content, sandbox);
        languagesMap[file.substr(0, 2)] = sandbox.module.exports;
      });
    }));
  }).then(function () {
    return googleSpreadsheet.authorize();
  }).then(function () {
    return googleSpreadsheet.clearSpreadsheet(spreadsheetId, sheet + '!A1:C');
  }).then(function () {
    return googleSpreadsheet.writeSpreadsheet(spreadsheetId, sheet + '!A1:C', (0, _languagesToSpreadsheet2.default)(languagesMap));
  }).then(function () {
    return console.log('Successful export');
  }).catch(function (err) {
    return console.error(err);
  });
}