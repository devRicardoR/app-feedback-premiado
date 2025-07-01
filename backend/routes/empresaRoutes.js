const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// ROTAS PÚBLICAS
router.post('/cadastro', upload.single('fotoFachada'), empresaController.cadastro); // Adiciona upload
router.post('/cadastro', empresaController.cadastro); // Cadastro da empresa
router.get('/', empresaController.listarEmpresas);    // Lista todas as empresas
router.get('/ranking', empresaController.rankingEmpresas); // Ranking de empresas


// Coloque esta rota ANTES da rota com :id para evitar conflito
router.use(authMiddleware); // Tudo abaixo daqui exige login
router.get('/me', empresaController.me); // Dados da empresa logada

router.put('/me', upload.single('fotoFachada'), empresaController.atualizar);

router.get('/:id', empresaController.detalharEmpresa); // Detalhar uma empresa por ID

module.exports = router;