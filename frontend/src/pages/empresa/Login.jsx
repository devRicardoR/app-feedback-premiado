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
        <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow flex flex-col">
            {/* Topo padrão */}
            <header className="bg-[#504b4d] p-4 text-center font-extrabold text-lg text-white shadow-lg">
                Feedback Premiado
            </header>

            {/* Formulário de login */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-lg p-8">
                    <h1 className="text-3xl font-extrabold mb-8 text-white text-center uppercase tracking-wide drop-shadow-lg">
                        Login Empresa
                    </h1>

                    {erro && (
                        <p className="mb-6 text-red-500 font-semibold text-center text-lg">{erro}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-5 py-3 rounded-2xl bg-white/30 placeholder-white/70 text-red-900 font-semibold outline-none backdrop-blur-md focus:ring-4 focus:ring-white transition"
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            className="w-full px-5 py-3 rounded-2xl bg-white/30 placeholder-white/70 text-red-900 font-semibold outline-none backdrop-blur-md focus:ring-4 focus:ring-white transition"
                        />
                        <button
                            type="submit"
                            className="w-full bg-brandGreen hover:bg-green-600 text-white py-3 rounded-2xl font-extrabold uppercase tracking-wide shadow-lg transition focus:ring-4 focus:ring-[#5B1B29]"
                        >
                            Entrar
                        </button>
                    </form>

                    <p className="mt-6 text-center text-white/80 text-lg">
                        Não tem conta?{' '}
                        <a href="/empresa/cadastro" className="text-red-900">
                            Cadastre-se
                        </a>
                    </p>

                    <div className="mt-8 text-center">
                        <button
                            onClick={voltarPaginaInicial}
                            className="bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-2xl font-semibold transition focus:ring-4 focus:ring-white"
                        >
                            Voltar para a página inicial
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}