import GoogleSpreadsheet from './GoogleSpreadsheet';

describe('Google Spreadsheet lib', () => {
  beforeAll(() => (jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000));
  afterAll(() => (jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000));
  it('should check that exists a token saved', (done) => {
    const googleSpreadsheet = new GoogleSpreadsheet('JB1SBoYjFkCt0IMG5YRDNnAY', '628890708825-ssbaqsi6u1e4si2kc2o5tut4g1g0593n.apps.googleusercontent.com');
    googleSpreadsheet.authorize()
      .then(() => {
        done(googleSpreadsheet);
      })
      .catch(err => fail(err));
  });
  it('should check that exists a token saved', (done) => {
    const googleSpreadsheet = new GoogleSpreadsheet('JB1SBoYjFkCt0IMG5YRDNnAY', '628890708825-ssbaqsi6u1e4si2kc2o5tut4g1g0593n.apps.googleusercontent.com');
    googleSpreadsheet.authorize()
    .then(() => googleSpreadsheet.readSpreadsheet('190rRsi06eQGxkOzHH0QMaONpsfbiV3zeswDW3GDQEyk', 'A1:C')
      .then((data) => {
        expect(data.values.length).toBeGreaterThan(0);
        done(googleSpreadsheet);
      }));
  });
});
