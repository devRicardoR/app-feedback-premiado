import React, { useState, useEffect } from 'react';
import api, { setToken } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ClienteCadastro({ isEdit = false }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarDados() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/cliente/login');
                    return;
                }
                setToken(token);
                const response = await api.get('/clientes/me');
                const { nome, email } = response.data;
                setNome(nome);
                setEmail(email);
            } catch (error) {
                console.error('Erro ao carregar dados do perfil:', error);
                setErro('Erro ao carregar dados do perfil');
            }
        }

        if (isEdit) {
            carregarDados();
        }
    }, [isEdit, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put('/clientes/editar', { nome, email, senha });
                alert('Perfil atualizado com sucesso!');
                navigate('/cliente/painel');
            } else {
                await api.post('/clientes/cadastro', { nome, email, senha });
                alert('Cadastro realizado com sucesso! Faça login.');
                navigate('/');
            }
        } catch (error) {
            setErro(error.response?.data?.message || 'Erro ao processar requisição');
        }
    }

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow flex items-center justify-center p-6">
            <main className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-3xl shadow-lg border border-white/30 p-8">
                <h1 className="text-3xl font-extrabold mb-8 text-red-900 text-center uppercase tracking-wide drop-shadow-lg">
                    {isEdit ? 'Editar Perfil' : 'Cadastro Cliente'}
                </h1>
                {erro && (
                    <p className="mb-6 text-red-500 font-semibold text-center text-lg">{erro}</p>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Nome completo"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                        className="w-full px-5 py-3 rounded-2xl bg-white/30 placeholder-white/70 text-white font-semibold outline-none backdrop-blur-md focus:ring-4 focus:ring-white transition"
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full px-5 py-3 rounded-2xl bg-white/30 placeholder-white/70 text-white font-semibold outline-none backdrop-blur-md focus:ring-4 focus:ring-white transition"
                    />
                    <input
                        type="password"
                        placeholder={isEdit ? 'Nova senha (deixe vazio para manter)' : 'Senha'}
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        className="w-full px-5 py-3 rounded-2xl bg-white/30 placeholder-white/70 text-white font-semibold outline-none backdrop-blur-md focus:ring-4 focus:ring-white transition"
                        {...(!isEdit && { required: true })}
                    />
                    <button
                        type="submit"
                        className="w-full bg-brandGreen hover:bg-green-600 text-white py-3 rounded-2xl font-extrabold uppercase tracking-wide shadow-lg transition focus:ring-4 focus:ring-[#5B1B29]"
                    >
                        {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
                    </button>
                </form>
            </main>
        </div>
    );
}