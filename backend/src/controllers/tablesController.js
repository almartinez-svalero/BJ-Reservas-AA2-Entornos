const db = require('../config/database');

const getAllTables = (req, res) => {
  const sql = 'SELECT * FROM tables_restaurant ORDER BY id DESC';
  db.all(sql, [], (error, rows) => {
    if (error) return res.status(500).json({ message: error.message });
    res.json(rows);
  });
};

const getTableById = (req, res) => {
  const sql = 'SELECT * FROM tables_restaurant WHERE id = ?';
  db.get(sql, [req.params.id], (error, row) => {
    if (error) return res.status(500).json({ message: error.message });
    if (!row) return res.status(404).json({ message: 'Mesa no encontrada' });
    res.json(row);
  });
};

const createTable = (req, res) => {
  const { name, capacity, zone, is_available = 1 } = req.body;
  const sql = 'INSERT INTO tables_restaurant (name, capacity, zone, is_available) VALUES (?, ?, ?, ?)';

  db.run(sql, [name, capacity, zone, is_available], function (error) {
    if (error) return res.status(400).json({ message: 'No se pudo crear la mesa', detail: error.message });
    res.status(201).json({ id: this.lastID, name, capacity, zone, is_available });
  });
};

const updateTable = (req, res) => {
  const { name, capacity, zone, is_available = 1 } = req.body;
  const sql = 'UPDATE tables_restaurant SET name = ?, capacity = ?, zone = ?, is_available = ? WHERE id = ?';

  db.run(sql, [name, capacity, zone, is_available, req.params.id], function (error) {
    if (error) return res.status(400).json({ message: 'No se pudo actualizar la mesa', detail: error.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Mesa no encontrada' });
    res.json({ id: Number(req.params.id), name, capacity, zone, is_available });
  });
};

const deleteTable = (req, res) => {
  const sql = 'DELETE FROM tables_restaurant WHERE id = ?';
  db.run(sql, [req.params.id], function (error) {
    if (error) return res.status(500).json({ message: error.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Mesa no encontrada' });
    res.json({ message: 'Mesa eliminada correctamente' });
  });
};

module.exports = {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable
};
