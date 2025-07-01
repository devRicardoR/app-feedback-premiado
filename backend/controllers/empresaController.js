const Empresa = require('../models/Empresa');
const Print = require('../models/Print');
const bcrypt = require('bcryptjs');

// Função para cadastro da empresa
exports.cadastro = async (req, res) => {
    try {
        // Para receber o endereço como objeto JSON, parse ele:
        const endereco = JSON.parse(req.body.endereco);

        const { nome, email, senha, cnpj_cpf } = req.body;

        if (!nome || !email || !senha || !cnpj_cpf) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        const empresaExistente = await Empresa.findOne({ email });
        if (empresaExistente) {
            return res.status(400).json({ message: 'Empresa já cadastrada com este email.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novaEmpresa = new Empresa({
            nome,
            email,
            senha: senhaHash,
            cnpj_cpf,
            endereco,
            fachada: req.file ? req.file.filename : null, // salvar nome do arquivo no campo fachada
        });

        await novaEmpresa.save();

        return res.status(201).json({ message: 'Empresa cadastrada com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao cadastrar empresa.' });
    }
};

// Atualizar dados da empresa logada
exports.atualizar = async (req, res) => {
    try {
        const empresa = await Empresa.findById(req.user.id);
        if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });

        const { nome, email, senha, cnpj_cpf } = req.body;
        const endereco = req.body.endereco ? JSON.parse(req.body.endereco) : null;

        if (nome) empresa.nome = nome;
        if (email) empresa.email = email;
        if (cnpj_cpf) empresa.cnpj_cpf = cnpj_cpf; // cuidado: só permitir se for seguro alterar
        if (endereco) empresa.endereco = endereco;

        if (senha && senha.trim() !== '') {
            const senhaHash = await bcrypt.hash(senha, 10);
            empresa.senha = senhaHash;
        }

        if (req.file) {
            empresa.fachada = req.file.filename;
        }

        await empresa.save();
        res.json({ message: 'Empresa atualizada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar empresa.' });
    }
};

// Busca empresas filtrando por nome e cidade, retorna lista
exports.listarEmpresas = async (req, res) => {
    try {
        const { nome = '', cidade = '' } = req.query;

        const filtro = {
        nome: { $regex: nome, $options: 'i' },
        'endereco.cidade': { $regex: cidade, $options: 'i' },
        };

        const empresas = await Empresa.find(filtro).select('nome endereco');

        const empresasComPrints = await Promise.all(
        empresas.map(async (empresa) => {
            const countPrints = await Print.countDocuments({ id_empresa: empresa._id });
            return {
            _id: empresa._id,
            nome: empresa.nome,
            cidade: empresa.endereco?.cidade || '',
            printsConcluidos: countPrints,
            };
        })
        );

        res.json(empresasComPrints);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar empresas' });
    }
};

// Ranking das empresas com mais prints (ordenado desc)
exports.rankingEmpresas = async (req, res) => {
    try {
        const ranking = await Print.aggregate([
        {
            $group: {
            _id: '$id_empresa',
            totalPrints: { $sum: 1 },
            },
        },
        {
            $lookup: {
            from: 'empresas',
            localField: '_id',
            foreignField: '_id',
            as: 'empresa',
            },
        },
        { $unwind: '$empresa' },
        {
            $project: {
            empresaId: '$_id',
            nome: '$empresa.nome',
            cidade: '$empresa.endereco.cidade',
            totalPrints: 1,
            },
        },
        { $sort: { totalPrints: -1 } },
        ]);

        const resultado = ranking.map((r) => ({
        _id: r.empresaId,
        nome: r.nome,
        cidade: r.cidade,
        printsConcluidos: r.totalPrints,
        }));

        res.json(resultado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar ranking' });
    }
};

// Detalhar empresa pelo ID
exports.detalharEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const empresa = await Empresa.findById(id).select('-senha');
        if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
        res.json(empresa);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar empresa' });
    }
};

// Dados da empresa logada (usuário via token)
exports.me = async (req, res) => {
    try {
        const empresa = await Empresa.findById(req.user.id).select('-senha');
        if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
        res.json(empresa);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar empresa' });
    }
};