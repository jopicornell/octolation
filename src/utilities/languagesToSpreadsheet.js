import plainObject from './plainObject';

export default function languagesToSpreadsheet(languagesMap) {
  const plainedObject = {};
  Object.keys(languagesMap).forEach(
    (lang) => {
      const plain = plainObject(languagesMap[lang]);
      Object.keys(plain).forEach((key) => {
        if (plainedObject[key]) {
          plainedObject[key].push(plain[key]);
        } else {
          plainedObject[key] = [plain[key]];
        }
      });
    });
  const spreadsheetArray = Object.keys(plainedObject).map(key => [key, ...plainedObject[key]]);
  console.log(JSON.stringify(spreadsheetArray));
  spreadsheetArray.unshift(['code', ...Object.keys(languagesMap)]);
  return spreadsheetArray;
}
