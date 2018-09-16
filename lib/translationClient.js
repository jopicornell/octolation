'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = translationClient;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _translationImport = require('./translationImport');

var _translationImport2 = _interopRequireDefault(_translationImport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function translationClient() {
  _commander2.default.version('0.0.1');
  _commander2.default.command('import <clientId> <secret> <spreadsheetId> <sheet> <folder>').action(function (clientId, secret, spreadsheetId, sheet, folder) {
    return (0, _translationImport2.default)(clientId, secret, spreadsheetId, sheet, folder);
  });
  _commander2.default.parse(process.argv);
}