const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cnpj_cpf: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    endereco: {
        rua: String,
        numero: String,
        cidade: String,
    },
    fachada: { type: String }, // campo para o nome do arquivo da foto da fachada
});

module.exports = mongoose.model('Empresa', EmpresaSchema);