const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const google = require('googleapis');
const GoogleAuth = require('google-auth-library');

const sheets = google.sheets('v4');

class GoogleSpreadsheet {
  constructor(clientSecret, clientId) {
    this.clientSecret = clientSecret;
    this.clientId = clientId;
    this.tokenFile = `sheets.googleapis${this.clientSecret}.json`;
    this.tokenDirectory = path.join(__dirname, '../.credentials/');
    this.redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';
    this.token = null;

    const auth = new GoogleAuth();
    this.oauth2Client = new auth.OAuth2(this.clientId, this.clientSecret, this.redirectUrl);
  }

  authorize() {
    /* const clientSecret = 'JB1SBoYjFkCt0IMG5YRDNnAY';
    const clientId = '628890708825-ssbaqsi6u1e4si2kc2o5tut4g1g0593n.apps.googleusercontent.com';
    const redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';*/

    // Check if we have previously stored a token.
    return fs.readFile(this.tokenDirectory + this.tokenFile)
      .then((token) => {
        this.oauth2Client.credentials = JSON.parse(token);
      })
      .catch(() => this.getNewToken());
  }

  getNewToken() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve, reject) => {
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        this.oauth2Client.getToken(code, (err, token) => {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            return reject(err);
          }
          this.oauth2Client.credentials = token;
          this.storeToken(token);
          return resolve(token);
        });
      });
    });
  }

  storeToken(token) {
    return fs.mkdir(this.tokenDirectory)
      .then(() => fs.writeFile(this.tokenDirectory + this.tokenFile, JSON.stringify(token), { flag: 'w' }))
      .catch(() => fs.truncate(this.tokenDirectory + this.tokenFile, 0)
                    .then(() => fs.writeFile(this.tokenDirectory + this.tokenFile,
                      JSON.stringify(token)))
                    .catch(err => console.error('Error while trying to store token', err)));
  }

  readSpreadsheet(spreadsheetId, range) {
    return new Promise((resolve, reject) => sheets.spreadsheets.values.get({
      auth: this.oauth2Client,
      spreadsheetId,
      range,
    }, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    }));
  }

  writeSpreadsheet(spreadsheetId, range, values) {
    return new Promise((resolve, reject) => sheets.spreadsheets.values.update({
      auth: this.oauth2Client,
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values,
      },
    }, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    }));
  }

  clearSpreadsheet(spreadsheetId, range) {
    return new Promise((resolve, reject) => sheets.spreadsheets.values.clear({
      auth: this.oauth2Client,
      spreadsheetId,
      range,
    }, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    }));
  }
}

export default GoogleSpreadsheet;
