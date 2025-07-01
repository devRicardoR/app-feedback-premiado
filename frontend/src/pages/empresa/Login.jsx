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
        navigate('/'); // redireciona para a rota inicial do React Router
        // ou window.location.href = 'http://localhost:5173/'; para forçar recarregamento completo
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
            <h1 className="text-3xl font-bold mb-6 text-center">Login Empresa</h1>
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
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Entrar
                </button>
            </form>

            <p className="mt-4 text-center">
                Não tem conta?{' '}
                <a href="/empresa/cadastro" className="text-blue-600 underline">
                    Cadastre-se
                </a>
            </p>

            {/* Botão para voltar à página inicial */}
            <div className="mt-6 text-center">
                <button
                    onClick={voltarPaginaInicial}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                >
                    Voltar para a página inicial
                </button>
            </div>
        </div>
    );
}