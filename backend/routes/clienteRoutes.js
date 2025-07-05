const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/cadastro', clienteController.cadastrar);
router.get('/me', authMiddleware, clienteController.me);
router.put('/editar', authMiddleware, clienteController.editar);

module.exports = router;