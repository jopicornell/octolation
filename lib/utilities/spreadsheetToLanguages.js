function convertIdToMap(translationMap, id, value) {
  let obj = translationMap;
  const splittedId = id.split('.');
  for (let i = 0; i < splittedId.length - 1; i += 1) {
    if (!obj[splittedId[i]]) {
      obj[splittedId[i]] = {};
    }
    obj = obj[splittedId[i]];
  }
  obj[splittedId[splittedId.length - 1]] = value;
}

export default function spreadsheetToLanguages(rows) {
  const header = rows[0];
  const languagesMap = {};
  const languagesAux = {};
  for (let column = 1; column < header.length; column += 1) {
    languagesAux[header[column]] = column;
    languagesMap[header[column]] = {};
  }
  rows.shift();
  Object.keys(languagesAux).forEach((lang) => {
    const index = languagesAux[lang];
    rows.forEach((row) => {
      if (row[0]) {
        convertIdToMap(languagesMap[lang], row[0], row[index]);
      }
    });
  });
  return languagesMap;
}
