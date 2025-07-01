const Cliente = require('../models/Cliente');
const bcrypt = require('bcryptjs');

exports.cadastrar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        // Verificar se cliente já existe
        const clienteExistente = await Cliente.findOne({ email });
        if (clienteExistente) {
        return res.status(400).json({ message: 'Cliente já cadastrado com este email.' });
        }

        // Gerar hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Criar cliente com senha hash
        const novoCliente = new Cliente({
        nome,
        email,
        senha: senhaHash,
        });

        await novoCliente.save();

        res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar cliente.' });
    }
};