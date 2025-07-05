const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// ROTAS PÚBLICAS
router.post('/cadastro', upload.single('fachada'), empresaController.cadastro); // Corrigido: 'fachada'

router.get('/', empresaController.listarEmpresas);
router.get('/ranking', empresaController.rankingEmpresas);

// ROTAS PROTEGIDAS
router.use(authMiddleware);

router.get('/me', empresaController.me);
router.put('/me', upload.single('fachada'), empresaController.atualizar); // Corrigido: 'fachada'

router.get('/:id', empresaController.detalharEmpresa);

module.exports = router;