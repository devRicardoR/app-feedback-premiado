import React, { useState } from 'react';
import api, { setToken } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function EmpresaLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        try {
            const response = await api.post('/login', { email, senha, tipo: 'empresa' });
            const { token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('tipo', 'empresa');
            setToken(token);

            navigate('/empresa/painel');
        } catch (error) {
            setErro(error.response?.data?.message || 'Erro ao fazer login');
        }
    }

    function voltarPaginaInicial() {
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Topo padrão */}
            <header className="bg-[#0a0a23] p-4 text-white text-center font-semibold text-lg">
                Feedback Premiado
            </header>

            {/* Formulário de login */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded shadow p-6">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login Empresa</h1>

                    {erro && <p className="mb-4 text-red-600 text-sm text-center">{erro}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <button
                            type="submit"
                            className="w-full bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500 transition"
                        >
                            Entrar
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        Não tem conta?{' '}
                        <a href="/empresa/cadastro" className="text-yellow-500 underline hover:text-yellow-600">
                            Cadastre-se
                        </a>
                    </p>

                    <div className="mt-6 text-center">
                        <button
                            onClick={voltarPaginaInicial}
                            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition text-sm"
                        >
                            Voltar para a página inicial
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}