# Wiki de la API - BodegaReserva

## Introducción

La API de BodegaReserva permite gestionar mesas y reservas de un restaurante mediante endpoints REST.

Base URL local:

```text
http://localhost:3000/api
```

## Recurso: Mesas

### GET /tables

Devuelve todas las mesas registradas.

### GET /tables/:id

Devuelve una mesa concreta.

### POST /tables

Crea una nueva mesa.

Body esperado:

```json
{
  "name": "Mesa 6",
  "capacity": 4,
  "zone": "Interior",
  "is_available": 1
}
```

### PUT /tables/:id

Actualiza una mesa existente.

### DELETE /tables/:id

Elimina una mesa y sus reservas relacionadas por la regla `ON DELETE CASCADE`.

## Recurso: Reservas

### GET /reservations

Devuelve todas las reservas junto con información de la mesa asociada.

### GET /reservations/:id

Devuelve una reserva concreta.

### POST /reservations

Crea una reserva.

Body esperado:

```json
{
  "customer_name": "Marta López",
  "customer_phone": "600123456",
  "reservation_date": "2026-06-10",
  "reservation_time": "21:30",
  "guests": 4,
  "deposit": 20,
  "status": "CONFIRMADA",
  "table_id": 1
}
```

### PUT /reservations/:id

Actualiza una reserva existente.

### DELETE /reservations/:id

Elimina una reserva.

## Códigos de respuesta habituales

- `200`: operación realizada correctamente.
- `201`: elemento creado correctamente.
- `400`: error de validación o datos incorrectos.
- `404`: recurso no encontrado.
- `500`: error interno del servidor.
