import fs from 'fs-extra';
import { unflatten as unflat } from 'flat';
import javascriptStringify from 'javascript-stringify';
import GoogleSpreadsheet from './GoogleSpreadsheet';

const splitLanguages = (data) => {
  const languagesMap = {};
  const languagesList = data[0].slice(1); // array with langs, first column is "code"
  languagesList.forEach((lang, index) => {
    languagesMap[lang] = unflat(data.slice(1).reduce((before, after) => {
      const row = before;
      row[after[0]] = after[index + 1];
      return row;
    }, {}));
  });
  return languagesMap;
};

export default function translationImport(clientId, secret, spreadsheetId, sheet = 'Translations', folder) {
  const googleSpreadsheet = new GoogleSpreadsheet(secret, clientId);
  return googleSpreadsheet.authorize()
    .then(() => fs.mkdir(`.${folder}/langs`)
      .catch((err) => {
        if (err.code === 'EEXIST') {
          return Promise.resolve();
        }
        return Promise.reject(err);
      }))
    .then(() => googleSpreadsheet.readSpreadsheet(spreadsheetId, `${sheet}!A1:C`))
    .then((spreadsheetData) => {
      const languagesMap = splitLanguages(spreadsheetData.values);
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
