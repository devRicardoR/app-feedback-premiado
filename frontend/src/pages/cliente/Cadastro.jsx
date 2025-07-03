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
        <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 flex flex-col justify-center items-center p-6">
            <div className="max-w-md w-full bg-white rounded shadow p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-700">
                {isEdit ? 'Editar Perfil' : 'Cadastro Cliente'}
            </h1>
            {erro && <p className="mb-4 text-red-600">{erro}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
                />
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
                placeholder={isEdit ? 'Nova senha (deixe vazio para manter)' : 'Senha'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                {...(!isEdit && { required: true })}
                />
                <button
                type="submit"
                className="w-full bg-[#0a0a23] text-white py-2 rounded hover:bg-blue-900 transition font-semibold"
                >
                {isEdit ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
            </form>
            </div>
        </main>
        </div>
    );
}