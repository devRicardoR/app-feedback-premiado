const Cliente = require('../models/Cliente');
const Empresa = require('../models/Empresa');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        const { email, senha, tipo } = req.body;
        let user;

        if (tipo === 'cliente') {
        user = await Cliente.findOne({ email });
        } else if (tipo === 'empresa') {
        user = await Empresa.findOne({ email });
        } else {
        return res.status(400).json({ message: 'Tipo inválido' });
        }

        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) return res.status(401).json({ message: 'Senha incorreta' });

        const token = jwt.sign(
        { id: user._id, tipo },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no login' });
    }
};