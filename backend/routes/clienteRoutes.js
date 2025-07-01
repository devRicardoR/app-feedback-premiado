const express = require('express');
const router = express.Router();
const cliente = require('../controllers/clienteController');

router.post('/cadastro', cliente.cadastrar);

module.exports = router;