const express = require('express');
const router = express.Router();
const tablesController = require('../controllers/tablesController');
const validateRequest = require('../middleware/validateRequest');
const { tableIdValidator, tableValidator } = require('../validators/tableValidators');

router.get('/', tablesController.getAllTables);
router.get('/:id', tableIdValidator, validateRequest, tablesController.getTableById);
router.post('/', tableValidator, validateRequest, tablesController.createTable);
router.put('/:id', tableIdValidator, tableValidator, validateRequest, tablesController.updateTable);
router.delete('/:id', tableIdValidator, validateRequest, tablesController.deleteTable);

module.exports = router;
