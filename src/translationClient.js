import commander from 'commander';
import translationImport from './translationImport';

module.exports = function translationClient() {
  commander.version('0.0.1');
  commander.command('import <clientId> <secret> <spreadsheetId> <sheet> <folder>')
    .action((clientId, secret, spreadsheetId, sheet, folder) =>
      translationImport(clientId, secret, spreadsheetId, sheet, folder));
  commander.parse(process.argv);
};
