const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cnpj_cpf: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    endereco: {
        cep: { type: String },
        rua: { type: String, required: true },
        numero: { type: String, required: true },
        complemento: { type: String },
        bairro: { type: String, required: true },
        cidade: { type: String, required: true },
        estado: { type: String, required: true },
        localizacao: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    fachada: { type: String },
    printsCount: { type: Number, default: 0 }
}, { timestamps: true });

EmpresaSchema.index({ 'endereco.localizacao': '2dsphere' });

module.exports = mongoose.model('Empresa', EmpresaSchema);