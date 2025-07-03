const express = require('express');
const router = express.Router();
const cliente = require('../controllers/clienteController');
const autenticarToken = require('../middleware/authMiddleware');

// Cadastro
router.post('/cadastro', cliente.cadastrar);

// Obter dados do cliente logado
router.get('/me', autenticarToken, cliente.me);

// Editar dados do cliente logado
router.put('/editar', autenticarToken, cliente.editar); // <-- Adicionada aqui

module.exports = router;