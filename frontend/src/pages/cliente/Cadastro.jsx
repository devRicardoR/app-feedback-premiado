import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ClienteCadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
        await api.post('/clientes/cadastro', { nome, email, senha });
        alert('Cadastro realizado com sucesso! Faça login.');
        navigate('/');
        } catch (error) {
        setErro(error.response?.data?.message || 'Erro ao cadastrar');
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Cadastro Cliente</h1>
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
            Cadastrar
            </button>
        </form>
        </div>
    );
}