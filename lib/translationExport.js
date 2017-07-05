import fs from 'fs-extra';
import vm from 'vm';
import GoogleSpreadsheet from './GoogleSpreadsheet';
import languagesToSpreadsheet from './utilities/languagesToSpreadsheet';

export default function translationExport(clientId, secret, spreadsheetId, sheet = 'Translations', folder) {
  const googleSpreadsheet = new GoogleSpreadsheet(secret, clientId);
  const languagesMap = {};
  return fs.readdir(`.${folder}/langs/`)
    .then(files => Promise.all(files.map(file => fs.readFile(`.${folder}/langs/${file}`, 'utf8')
        .then((content) => {
          const sandbox = {
            module: {
              export: {},
            },
          };
          vm.runInNewContext(content, sandbox);
          languagesMap[file.substr(0, 2)] = sandbox.module.exports;
        }))))
    .then(() => googleSpreadsheet.authorize())
    .then(() => googleSpreadsheet.clearSpreadsheet(spreadsheetId, `${sheet}!A1:C`))
    .then(() => googleSpreadsheet.writeSpreadsheet(spreadsheetId, `${sheet}!A1:C`, languagesToSpreadsheet(languagesMap)))
    .then(() => console.log('Successful export'))
    .catch(err => console.error(err));
}
