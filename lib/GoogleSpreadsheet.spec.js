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