'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs-extra');
var path = require('path');
var readline = require('readline');

var _require = require('googleapis'),
    google = _require.google;

var _require2 = require('google-auth-library'),
    OAuth2Client = _require2.OAuth2Client;

var sheets = google.sheets('v4');

var GoogleSpreadsheet = function () {
  function GoogleSpreadsheet(clientSecret, clientId) {
    _classCallCheck(this, GoogleSpreadsheet);

    this.clientSecret = clientSecret;
    this.clientId = clientId;
    this.tokenFile = 'sheets.googleapis' + this.clientSecret + '.json';
    this.tokenDirectory = path.join(__dirname, '../.credentials/');
    this.redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';
    this.token = null;

    this.oauth2Client = new OAuth2Client(this.clientId, this.clientSecret, this.redirectUrl);
  }

  _createClass(GoogleSpreadsheet, [{
    key: 'authorize',
    value: function authorize() {
      var _this = this;

      /* const clientSecret = 'JB1SBoYjFkCt0IMG5YRDNnAY';
      const clientId = '628890708825-ssbaqsi6u1e4si2kc2o5tut4g1g0593n.apps.googleusercontent.com';
      const redirectUrl = 'urn:ietf:wg:oauth:2.0:oob'; */

      // Check if we have previously stored a token.
      return fs.readFile(this.tokenDirectory + this.tokenFile).then(function (token) {
        _this.oauth2Client.credentials = JSON.parse(token);
      }).catch(function () {
        return _this.getNewToken();
      });
    }
  }, {
    key: 'getNewToken',
    value: function getNewToken() {
      var _this2 = this;

      var authUrl = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets']
      });
      console.log('Authorize this app by visiting this url: ', authUrl);
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      return new Promise(function (resolve, reject) {
        rl.question('Enter the code from that page here: ', function (code) {
          rl.close();
          _this2.oauth2Client.getToken(code, function (err, token) {
            if (err) {
              console.log('Error while trying to retrieve access token', err);
              return reject(err);
            }
            _this2.oauth2Client.credentials = token;
            _this2.storeToken(token);
            return resolve(token);
          });
        });
      });
    }
  }, {
    key: 'storeToken',
    value: function storeToken(token) {
      var _this3 = this;

      return fs.mkdir(this.tokenDirectory).then(function () {
        return fs.writeFile(_this3.tokenDirectory + _this3.tokenFile, JSON.stringify(token), { flag: 'w' });
      }).catch(function () {
        return fs.truncate(_this3.tokenDirectory + _this3.tokenFile, 0).then(function () {
          return fs.writeFile(_this3.tokenDirectory + _this3.tokenFile, JSON.stringify(token));
        }).catch(function (err) {
          return console.error('Error while trying to store token', err);
        });
      });
    }
  }, {
    key: 'readSpreadsheet',
    value: function readSpreadsheet(spreadsheetId, range) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        return sheets.spreadsheets.values.get({
          auth: _this4.oauth2Client,
          spreadsheetId: spreadsheetId,
          range: range
        }, function (err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
      });
    }
  }, {
    key: 'writeSpreadsheet',
    value: function writeSpreadsheet(spreadsheetId, range, values) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        return sheets.spreadsheets.values.update({
          auth: _this5.oauth2Client,
          spreadsheetId: spreadsheetId,
          range: range,
          valueInputOption: 'RAW',
          resource: {
            values: values
          }
        }, function (err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
      });
    }
  }, {
    key: 'clearSpreadsheet',
    value: function clearSpreadsheet(spreadsheetId, range) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        return sheets.spreadsheets.values.clear({
          auth: _this6.oauth2Client,
          spreadsheetId: spreadsheetId,
          range: range
        }, function (err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
      });
    }
  }]);

  return GoogleSpreadsheet;
}();

exports.default = GoogleSpreadsheet;
'use strict';

var _GoogleSpreadsheet = require('./GoogleSpreadsheet');

var _GoogleSpreadsheet2 = _interopRequireDefault(_GoogleSpreadsheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Google Spreadsheet lib', function () {
  beforeAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });
  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  it('should check that exists a token saved', function (done) {
    var googleSpreadsheet = new _GoogleSpreadsheet2.default('JB1SBoYjFkCt0IMG5YRDNnAY', '628890708825-ssbaqsi6u1e4si2kc2o5tut4g1g0593n.apps.googleusercontent.com');
    googleSpreadsheet.authorize().then(function () {
      done(googleSpreadsheet);
    }).catch(function (err) {
      return fail(err);
    });
  });
  it('should check that exists a token saved', function (done) {
    var googleSpreadsheet = new _GoogleSpreadsheet2.default('JB1SBoYjFkCt0IMG5YRDNnAY', '628890708825-ssbaqsi6u1e4si2kc2o5tut4g1g0593n.apps.googleusercontent.com');
    googleSpreadsheet.authorize().then(function () {
      return googleSpreadsheet.readSpreadsheet('190rRsi06eQGxkOzHH0QMaONpsfbiV3zeswDW3GDQEyk', 'A1:C').then(function (data) {
        expect(data.values.length).toBeGreaterThan(0);
        done(googleSpreadsheet);
      });
    });
  });
});
#!/usr/bin/env node
'use strict';

var _translationClient = require('./translationClient');

var _translationClient2 = _interopRequireDefault(_translationClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _translationClient2.default)();
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = translationClient;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _translationImport = require('./translationImport');

var _translationImport2 = _interopRequireDefault(_translationImport);

var _translationExport = require('./translationExport');

var _translationExport2 = _interopRequireDefault(_translationExport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function translationClient() {
  _commander2.default.version('0.0.1');
  _commander2.default.command('import <clientId> <secret> <spreadsheetId> <sheet> <folder>').action(function (clientId, secret, spreadsheetId, sheet, folder) {
    return (0, _translationImport2.default)(clientId, secret, spreadsheetId, sheet, folder);
  });
  _commander2.default.command('export <clientId> <secret> <spreadsheetId> <sheet> <folder>').action(function (clientId, secret, spreadsheetId, sheet, folder) {
    return (0, _translationExport2.default)(clientId, secret, spreadsheetId, sheet, folder);
  });
  _commander2.default.parse(process.argv);
}
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
    return googleSpreadsheet.readSpreadsheet(spreadsheetId, sheet + '!A1:C');
  }).then(function (spreadsheetData) {
    return _fsExtra2.default.mkdir('.' + folder + '/langs').catch(function (err) {
      if (err.code === 'EEXIST') {
        return Promise.resolve(spreadsheetData);
      }
      return Promise.reject(err);
    });
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
