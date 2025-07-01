const Print = require('../models/Print');
const Tarefa = require('../models/Tarefa');

exports.enviarPrint = async (req, res) => {
    try {
        const { id_empresa, id_tarefa } = req.body;
        if (!req.file) {
        return res.status(400).json({ message: 'Imagem do comprovante é obrigatória' });
    }

    // Buscar tarefa para pegar desconto
    const tarefa = await Tarefa.findById(id_tarefa);
    if (!tarefa) return res.status(404).json({ message: 'Tarefa não encontrada' });

    // Criar registro print
    const novoPrint = new Print({
        id_empresa,
        id_tarefa,
        id_cliente: req.user.id, // do token JWT
        imagem: req.file.filename,
        data_upload: new Date(),
        });

        await novoPrint.save();

        res.json({ message: 'Print enviado com sucesso', desconto: tarefa.desconto });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao enviar print' });
    }
};

exports.listarPrintsPorEmpresa = async (req, res) => {
    try {
        const prints = await Print.find({ id_empresa: req.params.id });
        res.json(prints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao listar prints' });
    }
};

exports.excluirPrint = async (req, res) => {
    try {
        const print = await Print.findById(req.params.id);
        if (!print) return res.status(404).json({ message: 'Print não encontrado' });

        // Verificar se usuário tem permissão (opcional, se quiser)
        await print.deleteOne();
        res.json({ message: 'Print excluído com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao excluir print' });
    }
};