# BJ-Reservas

BJ-Reservas es una aplicación web sencilla para gestionar mesas y reservas de un restaurante.

El proyecto está dividido en dos partes:

- Backend con Node.js, Express y SQLite.
- Frontend con HTML, CSS y JavaScript.

## Tecnologías usadas

- Node.js
- Express
- SQLite
- HTML
- CSS
- JavaScript
- express-validator
- Git y GitHub

## Funcionalidades

La aplicación permite gestionar:

- Mesas
- Reservas

En ambos casos se puede:

- Crear
- Ver
- Editar
- Eliminar

Las reservas están relacionadas con las mesas, ya que cada reserva se asigna a una mesa concreta.

## Cómo ejecutar el proyecto

Entrar en la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear la base de datos:

```bash
node src/db/initDb.js
```

Arrancar el servidor:

```bash
npm start
```

El backend se ejecuta en:

```text
http://localhost:3000
```

Ruta de prueba:

```text
http://localhost:3000/api/health
```

Para abrir el frontend, entrar en la carpeta `frontend` y abrir el archivo:

```text
index.html
```

También se puede usar Live Server.

## Endpoints principales

Mesas:

```http
GET /api/tables
POST /api/tables
PUT /api/tables/:id
DELETE /api/tables/:id
```

Reservas:

```http
GET /api/reservations
POST /api/reservations
PUT /api/reservations/:id
DELETE /api/reservations/:id
```

## Validaciones

El proyecto incluye validaciones en backend y frontend.

En el backend se usa `express-validator` para comprobar los datos antes de guardarlos en SQLite.

Algunas validaciones son:

- Nombre de mesa obligatorio.
- Capacidad correcta.
- Nombre del cliente obligatorio.
- Teléfono válido.
- Número de comensales correcto.
- Señal de reserva no negativa.

## GitFlow

El proyecto se ha desarrollado usando ramas y Pull Requests.

Ramas principales utilizadas:

- `feature/backend-setup`
- `feature/tables-crud`
- `feature/reservations-crud`
- `feature/frontend-layout`
- `feature/frontend-crud`
- `feature/validations`
- `feature/documentation`

## Autor

Álvaro Martínez

Actividad de Aprendizaje 2  
Entornos de Desarrollo