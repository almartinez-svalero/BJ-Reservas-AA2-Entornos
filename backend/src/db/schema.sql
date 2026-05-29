DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS tables_restaurant;

CREATE TABLE tables_restaurant (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL CHECK(capacity > 0),
  zone TEXT NOT NULL,
  is_available INTEGER NOT NULL DEFAULT 1 CHECK(is_available IN (0, 1))
);

CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reservation_date TEXT NOT NULL,
  reservation_time TEXT NOT NULL,
  guests INTEGER NOT NULL CHECK(guests > 0),
  deposit REAL NOT NULL DEFAULT 10 CHECK(deposit >= 0),
  status TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK(status IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA')),
  table_id INTEGER NOT NULL,
  FOREIGN KEY (table_id) REFERENCES tables_restaurant(id) ON DELETE CASCADE
);

INSERT INTO tables_restaurant (name, capacity, zone, is_available) VALUES
('Mesa 1', 2, 'Interior', 1),
('Mesa 2', 4, 'Interior', 1),
('Mesa 3', 6, 'Terraza', 1),
('Mesa 4', 4, 'Terraza', 1);

INSERT INTO reservations (customer_name, customer_phone, reservation_date, reservation_time, guests, deposit, status, table_id) VALUES
('Laura Pérez', '600111222', '2026-06-01', '21:00', 2, 10, 'CONFIRMADA', 1),
('Carlos Martín', '600333444', '2026-06-02', '14:30', 4, 20, 'PENDIENTE', 2);
