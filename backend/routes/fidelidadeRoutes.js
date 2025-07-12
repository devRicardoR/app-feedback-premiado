const express = require('express');
const router = express.Router();
const fidelidadeController = require('../controllers/fidelidadeController');
const authMiddleware = require('../middleware/authMiddleware');

// Cliente vê seu progresso no programa da empresa
router.get('/progresso/:id', authMiddleware, fidelidadeController.progressoCliente);

// Cliente participa do programa de fidelidade
router.post('/participar/:id', authMiddleware, fidelidadeController.participarPrograma);

// Empresa visualiza o programa de fidelidade
router.get('/:id', fidelidadeController.obterPrograma);

// Empresa cria o programa de fidelidade
router.post('/', authMiddleware, (req, res) => {
    req.userId = req.user.id;
    fidelidadeController.criarPrograma(req, res);
});

// Empresa atualiza o programa de fidelidade
router.put('/', authMiddleware, (req, res) => {
    req.userId = req.user.id;
    fidelidadeController.atualizarPrograma(req, res);
});

// Empresa dá carimbo ao cliente
router.post('/carimbar', authMiddleware, fidelidadeController.carimbarCliente);

module.exports = router;