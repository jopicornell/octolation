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
      return sheets.spreadsheets.values.get({
        auth: this.oauth2Client,
        spreadsheetId: spreadsheetId,
        range: range
      });
    }
  }, {
    key: 'writeSpreadsheet',
    value: function writeSpreadsheet(spreadsheetId, range, values) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        return sheets.spreadsheets.values.update({
          auth: _this4.oauth2Client,
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
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        return sheets.spreadsheets.values.clear({
          auth: _this5.oauth2Client,
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