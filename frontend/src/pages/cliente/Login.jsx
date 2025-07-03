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
        const response = await api.post('/login', { email, senha, tipo: 'cliente' });
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
        navigate('/');
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
        <header className="bg-[#0a0a23] p-4 text-center font-semibold text-lg text-white shadow">
            Feedback Premiado
        </header>

        <main className="flex-1 flex flex-col justify-center items-center p-6">
            <div className="max-w-md w-full bg-white rounded shadow p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Login Cliente</h1>
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
                className="w-full bg-[#0a0a23] text-white py-2 rounded hover:bg-blue-900 transition font-semibold"
                >
                Entrar
                </button>
            </form>

            <p className="mt-4 text-center text-gray-700">
                Não tem conta?{' '}
                <a href="/cliente/cadastro" className="text-blue-600 underline">
                Cadastre-se
                </a>
            </p>

            <button
                onClick={handleVoltar}
                className="mt-6 w-full bg-[#0a0a23] text-white py-2 rounded hover:bg-blue-900 transition font-semibold"
            >
                Voltar para página inicial
            </button>
            </div>
        </main>
        </div>
    );
}