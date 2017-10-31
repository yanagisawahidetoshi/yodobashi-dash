var sqlite3 = require('sqlite3');

module.exports.init = function (db) {
  return new sqlite3.Database(db);
};