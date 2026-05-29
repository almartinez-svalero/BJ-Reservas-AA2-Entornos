const db = require('../config/database');

const getAllReservations = (req, res) => {
  const sql = `
    SELECT reservations.*, tables_restaurant.name AS table_name, tables_restaurant.zone AS table_zone
    FROM reservations
    JOIN tables_restaurant ON reservations.table_id = tables_restaurant.id
    ORDER BY reservation_date DESC, reservation_time DESC
  `;
  db.all(sql, [], (error, rows) => {
    if (error) return res.status(500).json({ message: error.message });
    res.json(rows);
  });
};

const getReservationById = (req, res) => {
  const sql = `
    SELECT reservations.*, tables_restaurant.name AS table_name, tables_restaurant.zone AS table_zone
    FROM reservations
    JOIN tables_restaurant ON reservations.table_id = tables_restaurant.id
    WHERE reservations.id = ?
  `;
  db.get(sql, [req.params.id], (error, row) => {
    if (error) return res.status(500).json({ message: error.message });
    if (!row) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json(row);
  });
};

const createReservation = (req, res) => {
  const { customer_name, customer_phone, reservation_date, reservation_time, guests, deposit, status, table_id } = req.body;

  db.get('SELECT id, capacity FROM tables_restaurant WHERE id = ? AND is_available = 1', [table_id], (tableError, table) => {
    if (tableError) return res.status(500).json({ message: tableError.message });
    if (!table) return res.status(400).json({ message: 'La mesa seleccionada no existe o no está disponible' });
    if (Number(guests) > table.capacity) return res.status(400).json({ message: 'La mesa no tiene capacidad suficiente' });

    const sql = `
      INSERT INTO reservations (customer_name, customer_phone, reservation_date, reservation_time, guests, deposit, status, table_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [customer_name, customer_phone, reservation_date, reservation_time, guests, deposit, status, table_id], function (error) {
      if (error) return res.status(400).json({ message: 'No se pudo crear la reserva', detail: error.message });
      res.status(201).json({ id: this.lastID, customer_name, customer_phone, reservation_date, reservation_time, guests, deposit, status, table_id });
    });
  });
};

const updateReservation = (req, res) => {
  const { customer_name, customer_phone, reservation_date, reservation_time, guests, deposit, status, table_id } = req.body;

  db.get('SELECT id, capacity FROM tables_restaurant WHERE id = ? AND is_available = 1', [table_id], (tableError, table) => {
    if (tableError) return res.status(500).json({ message: tableError.message });
    if (!table) return res.status(400).json({ message: 'La mesa seleccionada no existe o no está disponible' });
    if (Number(guests) > table.capacity) return res.status(400).json({ message: 'La mesa no tiene capacidad suficiente' });

    const sql = `
      UPDATE reservations
      SET customer_name = ?, customer_phone = ?, reservation_date = ?, reservation_time = ?, guests = ?, deposit = ?, status = ?, table_id = ?
      WHERE id = ?
    `;

    db.run(sql, [customer_name, customer_phone, reservation_date, reservation_time, guests, deposit, status, table_id, req.params.id], function (error) {
      if (error) return res.status(400).json({ message: 'No se pudo actualizar la reserva', detail: error.message });
      if (this.changes === 0) return res.status(404).json({ message: 'Reserva no encontrada' });
      res.json({ id: Number(req.params.id), customer_name, customer_phone, reservation_date, reservation_time, guests, deposit, status, table_id });
    });
  });
};

const deleteReservation = (req, res) => {
  const sql = 'DELETE FROM reservations WHERE id = ?';
  db.run(sql, [req.params.id], function (error) {
    if (error) return res.status(500).json({ message: error.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json({ message: 'Reserva eliminada correctamente' });
  });
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};
