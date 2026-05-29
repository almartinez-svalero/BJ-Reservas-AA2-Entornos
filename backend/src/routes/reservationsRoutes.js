const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');
const validateRequest = require('../middleware/validateRequest');
const { reservationIdValidator, reservationValidator } = require('../validators/reservationValidators');

router.get('/', reservationsController.getAllReservations);
router.get('/:id', reservationIdValidator, validateRequest, reservationsController.getReservationById);
router.post('/', reservationValidator, validateRequest, reservationsController.createReservation);
router.put('/:id', reservationIdValidator, reservationValidator, validateRequest, reservationsController.updateReservation);
router.delete('/:id', reservationIdValidator, validateRequest, reservationsController.deleteReservation);

module.exports = router;
