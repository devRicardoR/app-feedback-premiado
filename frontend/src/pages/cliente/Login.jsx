import React, { useState } from 'react';
import api, { setToken } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ClienteLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        try {
            const response = await api.post('/login', { email, senha, tipo: 'cliente' }); // <== adicionado tipo
            const { token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('tipo', 'cliente');
            setToken(token);

            navigate('/cliente/painel');
        } catch (error) {
            setErro(error.response?.data?.message || 'Erro ao fazer login');
        }
    }

    function handleVoltar() {
        navigate('/'); // vai para página inicial de escolha (empresa ou cliente)
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
            <h1 className="text-3xl font-bold mb-6 text-center">Login Cliente</h1>
            {erro && <p className="mb-4 text-red-600">{erro}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Entrar
                </button>
            </form>

            <p className="mt-4 text-center">
                Não tem conta?{' '}
                <a href="/cliente/cadastro" className="text-blue-600 underline">
                    Cadastre-se
                </a>
            </p>

            <button
                onClick={handleVoltar}
                className="mt-6 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
            >
                Voltar para página inicial
            </button>
        </div>
    );
}