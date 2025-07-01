const mongoose = require('mongoose');

const PrintSchema = new mongoose.Schema({
    id_empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa' },
    id_tarefa: { type: mongoose.Schema.Types.ObjectId, ref: 'Tarefa' },
    id_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
    imagem: String,
    data_upload: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Print', PrintSchema);