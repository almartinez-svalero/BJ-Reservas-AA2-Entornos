const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'db', 'bodegareserva.sqlite');
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error('Error al conectar con SQLite:', error.message);
    return;
  }
  console.log('Base de datos SQLite conectada correctamente');
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
});

module.exports = db;
