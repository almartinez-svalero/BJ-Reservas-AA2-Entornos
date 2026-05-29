const { body, param } = require('express-validator');

const tableIdValidator = [
  param('id').isInt({ min: 1 }).withMessage('El id de la mesa debe ser un número entero positivo')
];

const tableValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre de la mesa es obligatorio')
    .isLength({ min: 3, max: 40 }).withMessage('El nombre debe tener entre 3 y 40 caracteres'),
  body('capacity')
    .isInt({ min: 1, max: 20 }).withMessage('La capacidad debe estar entre 1 y 20 personas'),
  body('zone')
    .trim()
    .notEmpty().withMessage('La zona es obligatoria')
    .isLength({ min: 3, max: 40 }).withMessage('La zona debe tener entre 3 y 40 caracteres'),
  body('is_available')
    .optional()
    .isInt({ min: 0, max: 1 }).withMessage('La disponibilidad debe ser 0 o 1')
];

module.exports = { tableIdValidator, tableValidator };
