import fs from 'fs-extra';
import javascriptStringify from 'javascript-stringify';
import GoogleSpreadsheet from './GoogleSpreadsheet';
import spreadsheetToLanguages from './utilities/spreadsheetToLanguages';

export default function translationImport(clientId, secret, spreadsheetId, sheet = 'Translations', folder) {
  const googleSpreadsheet = new GoogleSpreadsheet(secret, clientId);
  return googleSpreadsheet.authorize()
    .then(() => googleSpreadsheet.readSpreadsheet(spreadsheetId, `${sheet}!A1:C`))
    .then(spreadsheetData => fs.mkdir(`.${folder}/langs`)
      .catch((err) => {
        if (err.code === 'EEXIST') {
          return Promise.resolve(spreadsheetData);
        }
        return Promise.reject(err);
      }))
    .then((spreadsheetData) => {
      const languagesMap = spreadsheetToLanguages(spreadsheetData.values);
      return Promise.all(Object.keys(languagesMap)
        .map((lang) => {
          let contentTranslation = javascriptStringify(languagesMap[lang], null, 2);
          contentTranslation = `module.exports = ${contentTranslation}`;
          return fs.writeFile(`.${folder}/langs/${lang}.js`,
          contentTranslation);
        }));
    })
    .catch(err => console.error(err));
}
