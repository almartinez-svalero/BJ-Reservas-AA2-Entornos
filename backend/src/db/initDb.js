const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (error) => {
  if (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    process.exit(1);
  }

  console.log('Base de datos inicializada con datos de ejemplo');
  process.exit(0);
});
