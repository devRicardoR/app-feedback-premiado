const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true },
    senha: String,
});

module.exports = mongoose.model('Cliente', ClienteSchema);