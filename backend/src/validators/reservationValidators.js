// Validaciones para las operaciones CRUD de reservas
const { body, param } = require('express-validator');

const reservationIdValidator = [
  param('id').isInt({ min: 1 }).withMessage('El id de la reserva debe ser un número entero positivo')
];

const reservationValidator = [
  body('customer_name')
    .trim()
    .notEmpty().withMessage('El nombre del cliente es obligatorio')
    .isLength({ min: 3, max: 80 }).withMessage('El nombre debe tener entre 3 y 80 caracteres'),
  body('customer_phone')
    .trim()
    .matches(/^[0-9]{9,15}$/).withMessage('El teléfono debe tener entre 9 y 15 dígitos'),
  body('reservation_date')
    .isISO8601().withMessage('La fecha debe tener formato válido YYYY-MM-DD'),
  body('reservation_time')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('La hora debe tener formato HH:mm'),
  body('guests')
    .isInt({ min: 1, max: 20 }).withMessage('Los comensales deben estar entre 1 y 20'),
  body('deposit')
    .isFloat({ min: 0 }).withMessage('La señal debe ser un número igual o mayor que 0'),
  body('status')
    .isIn(['PENDIENTE', 'CONFIRMADA', 'CANCELADA']).withMessage('El estado debe ser PENDIENTE, CONFIRMADA o CANCELADA'),
  body('table_id')
    .isInt({ min: 1 }).withMessage('Debe seleccionarse una mesa válida')
];

module.exports = { reservationIdValidator, reservationValidator };
