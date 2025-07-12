const mongoose = require('mongoose');

const FidelidadeSchema = new mongoose.Schema({
    id_empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true,
    },
    titulo: {
        type: String,
        required: true,
        default: "Programa de Fidelidade",
    },
    descricao: {
        type: String,
        required: true,
        default: "Aqui você pode criar um programa fidelidade. Especifique o que seu cliente precisa cumprir e o que ele conseguirá ganhar de brinde após o cumprimento.",
    },
    regras: {
        type: String,
        required: true,
    },
    beneficios: {
        type: String,
        required: true,
    },
    meta: {
        type: Number,
        required: true,
    },
    clientes: [
        {
            id_cliente: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Cliente',
            },
            carimbos: {
                type: Number,
                default: 0,
            },
        },
    ],
    criado_em: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Fidelidade', FidelidadeSchema);