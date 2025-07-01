const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');  // Importa o módulo path
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta uploads via /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conecta ao MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Erro ao conectar MongoDB:', err));

// Rotas da API
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/empresas', require('./routes/empresaRoutes'));
app.use('/api/tarefas', require('./routes/tarefaRoutes'));
app.use('/api/prints', require('./routes/printRoutes'));
app.use('/api', require('./routes/authRoutes'));

module.exports = app;