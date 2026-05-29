const API_URL = 'http://localhost:3000/api';

const tableForm = document.getElementById('tableForm');
const reservationForm = document.getElementById('reservationForm');
const tablesList = document.getElementById('tablesList');
const reservationsList = document.getElementById('reservationsList');
const reservationTable = document.getElementById('reservationTable');
const tableMessage = document.getElementById('tableMessage');
const reservationMessage = document.getElementById('reservationMessage');
const tablesCount = document.getElementById('tablesCount');
const reservationsCount = document.getElementById('reservationsCount');

let tables = [];
let reservations = [];

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    const validationMessage = data.errors ? data.errors.map(error => error.msg).join(' | ') : data.message;
    throw new Error(validationMessage || 'Error en la petición');
  }

  return data;
};

const loadTables = async () => {
  tables = await request(`${API_URL}/tables`);
  renderTables();
  renderTableOptions();
  tablesCount.textContent = tables.length;
};

const loadReservations = async () => {
  reservations = await request(`${API_URL}/reservations`);
  renderReservations();
  reservationsCount.textContent = reservations.filter(reservation => reservation.status !== 'CANCELADA').length;
};

const renderTables = () => {
  tablesList.innerHTML = '';

  if (tables.length === 0) {
    tablesList.innerHTML = '<p>No hay mesas registradas.</p>';
    return;
  }

  tables.forEach(table => {
    const card = document.createElement('article');
    card.className = 'item-card';
    card.innerHTML = `
      <h3>${table.name}</h3>
      <p><strong>Capacidad:</strong> ${table.capacity} personas</p>
      <p><strong>Zona:</strong> ${table.zone}</p>
      <span class="badge">${table.is_available ? 'Disponible' : 'No disponible'}</span>
      <div class="card-actions">
        <button onclick="editTable(${table.id})">Editar</button>
        <button class="danger" onclick="deleteTable(${table.id})">Eliminar</button>
      </div>
    `;
    tablesList.appendChild(card);
  });
};

const renderTableOptions = () => {
  reservationTable.innerHTML = '';

  tables
    .filter(table => table.is_available)
    .forEach(table => {
      const option = document.createElement('option');
      option.value = table.id;
      option.textContent = `${table.name} · ${table.capacity} pax · ${table.zone}`;
      reservationTable.appendChild(option);
    });
};

const renderReservations = () => {
  reservationsList.innerHTML = '';

  if (reservations.length === 0) {
    reservationsList.innerHTML = '<p>No hay reservas registradas.</p>';
    return;
  }

  reservations.forEach(reservation => {
    const card = document.createElement('article');
    card.className = 'item-card';
    card.innerHTML = `
      <h3>${reservation.customer_name}</h3>
      <p><strong>Teléfono:</strong> ${reservation.customer_phone}</p>
      <p><strong>Fecha:</strong> ${reservation.reservation_date} a las ${reservation.reservation_time}</p>
      <p><strong>Comensales:</strong> ${reservation.guests}</p>
      <p><strong>Mesa:</strong> ${reservation.table_name} (${reservation.table_zone})</p>
      <p><strong>Señal:</strong> ${Number(reservation.deposit).toFixed(2)} €</p>
      <span class="badge">${reservation.status}</span>
      <div class="card-actions">
        <button onclick="editReservation(${reservation.id})">Editar</button>
        <button class="danger" onclick="deleteReservation(${reservation.id})">Eliminar</button>
      </div>
    `;
    reservationsList.appendChild(card);
  });
};

const validateTableForm = () => {
  const name = document.getElementById('tableName').value.trim();
  const capacity = Number(document.getElementById('tableCapacity').value);
  const zone = document.getElementById('tableZone').value.trim();

  if (name.length < 3) return 'El nombre de la mesa debe tener al menos 3 caracteres.';
  if (!capacity || capacity < 1 || capacity > 20) return 'La capacidad debe estar entre 1 y 20.';
  if (zone.length < 3) return 'La zona debe tener al menos 3 caracteres.';
  return null;
};

const validateReservationForm = () => {
  const customerName = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const guests = Number(document.getElementById('guests').value);
  const deposit = Number(document.getElementById('deposit').value);

  if (customerName.length < 3) return 'El nombre del cliente debe tener al menos 3 caracteres.';
  if (!/^[0-9]{9,15}$/.test(phone)) return 'El teléfono debe tener entre 9 y 15 dígitos.';
  if (!guests || guests < 1 || guests > 20) return 'Los comensales deben estar entre 1 y 20.';
  if (Number.isNaN(deposit) || deposit < 0) return 'La señal debe ser igual o mayor que 0.';
  if (!reservationTable.value) return 'Debes seleccionar una mesa.';
  return null;
};

tableForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  tableMessage.textContent = '';

  const error = validateTableForm();
  if (error) {
    tableMessage.textContent = error;
    return;
  }

  const id = document.getElementById('tableId').value;
  const payload = {
    name: document.getElementById('tableName').value.trim(),
    capacity: Number(document.getElementById('tableCapacity').value),
    zone: document.getElementById('tableZone').value.trim(),
    is_available: Number(document.getElementById('tableAvailable').value)
  };

  try {
    if (id) {
      await request(`${API_URL}/tables/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      tableMessage.textContent = 'Mesa actualizada correctamente.';
    } else {
      await request(`${API_URL}/tables`, { method: 'POST', body: JSON.stringify(payload) });
      tableMessage.textContent = 'Mesa creada correctamente.';
    }

    resetTableForm();
    await loadTables();
    await loadReservations();
  } catch (error) {
    tableMessage.textContent = error.message;
  }
});

reservationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  reservationMessage.textContent = '';

  const error = validateReservationForm();
  if (error) {
    reservationMessage.textContent = error;
    return;
  }

  const id = document.getElementById('reservationId').value;
  const payload = {
    customer_name: document.getElementById('customerName').value.trim(),
    customer_phone: document.getElementById('customerPhone').value.trim(),
    reservation_date: document.getElementById('reservationDate').value,
    reservation_time: document.getElementById('reservationTime').value,
    guests: Number(document.getElementById('guests').value),
    deposit: Number(document.getElementById('deposit').value),
    status: document.getElementById('status').value,
    table_id: Number(reservationTable.value)
  };

  try {
    if (id) {
      await request(`${API_URL}/reservations/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      reservationMessage.textContent = 'Reserva actualizada correctamente.';
    } else {
      await request(`${API_URL}/reservations`, { method: 'POST', body: JSON.stringify(payload) });
      reservationMessage.textContent = 'Reserva creada correctamente.';
    }

    resetReservationForm();
    await loadReservations();
  } catch (error) {
    reservationMessage.textContent = error.message;
  }
});

window.editTable = (id) => {
  const table = tables.find(item => item.id === id);
  if (!table) return;

  document.getElementById('tableId').value = table.id;
  document.getElementById('tableName').value = table.name;
  document.getElementById('tableCapacity').value = table.capacity;
  document.getElementById('tableZone').value = table.zone;
  document.getElementById('tableAvailable').value = table.is_available;
  tableMessage.textContent = 'Editando mesa seleccionada.';
};

window.deleteTable = async (id) => {
  const confirmDelete = confirm('Si eliminas esta mesa también se eliminarán sus reservas asociadas. ¿Continuar?');
  if (!confirmDelete) return;

  try {
    await request(`${API_URL}/tables/${id}`, { method: 'DELETE' });
    await loadTables();
    await loadReservations();
  } catch (error) {
    alert(error.message);
  }
};

window.editReservation = (id) => {
  const reservation = reservations.find(item => item.id === id);
  if (!reservation) return;

  document.getElementById('reservationId').value = reservation.id;
  document.getElementById('customerName').value = reservation.customer_name;
  document.getElementById('customerPhone').value = reservation.customer_phone;
  document.getElementById('reservationDate').value = reservation.reservation_date;
  document.getElementById('reservationTime').value = reservation.reservation_time;
  document.getElementById('guests').value = reservation.guests;
  document.getElementById('deposit').value = reservation.deposit;
  document.getElementById('status').value = reservation.status;
  reservationTable.value = reservation.table_id;
  reservationMessage.textContent = 'Editando reserva seleccionada.';
};

window.deleteReservation = async (id) => {
  const confirmDelete = confirm('¿Seguro que quieres eliminar esta reserva?');
  if (!confirmDelete) return;

  try {
    await request(`${API_URL}/reservations/${id}`, { method: 'DELETE' });
    await loadReservations();
  } catch (error) {
    alert(error.message);
  }
};

const resetTableForm = () => {
  tableForm.reset();
  document.getElementById('tableId').value = '';
  document.getElementById('tableAvailable').value = '1';
};

const resetReservationForm = () => {
  reservationForm.reset();
  document.getElementById('reservationId').value = '';
  document.getElementById('deposit').value = 10;
  document.getElementById('status').value = 'PENDIENTE';
};

document.getElementById('cancelTableEdit').addEventListener('click', () => {
  resetTableForm();
  tableMessage.textContent = '';
});

document.getElementById('cancelReservationEdit').addEventListener('click', () => {
  resetReservationForm();
  reservationMessage.textContent = '';
});

const init = async () => {
  try {
    await loadTables();
    await loadReservations();
  } catch (error) {
    alert(`No se pudo cargar la aplicación: ${error.message}`);
  }
};

init();
