import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BotaoLogout from '../../components/BotaoLogout';

export default function ClientePainel() {
    const [lojas, setLojas] = useState([]);
    const [busca, setBusca] = useState('');
    const [filtroCidade, setFiltroCidade] = useState('');
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        async function carregarLojas() {
        try {
            const res = await api.get('/empresas');
            setLojas(res.data);
        } catch (e) {
            console.error('Erro ao carregar lojas:', e);
        }
        }

        async function carregarRanking() {
        try {
            const res = await api.get('/empresas/ranking');
            setRanking(res.data);
        } catch (e) {
            console.error('Erro ao carregar ranking:', e);
        }
        }

        carregarLojas();
        carregarRanking();
    }, []);

    const lojasFiltradas = lojas.filter(loja =>
        loja.nome?.toLowerCase().includes(busca.toLowerCase()) &&
        (filtroCidade === '' || loja.endereco?.cidade?.toLowerCase() === filtroCidade.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 max-w-4xl mx-auto p-6 rounded shadow mt-6 bg-white">
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Painel do Cliente</h1>
            <BotaoLogout />
            </div>

            <div className="mb-4">
            <input
                type="text"
                placeholder="Buscar loja por nome"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="border px-3 py-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            </div>

            <div className="mb-8">
            <input
                type="text"
                placeholder="Filtrar por cidade"
                value={filtroCidade}
                onChange={e => setFiltroCidade(e.target.value)}
                className="border px-3 py-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">Lojas filtradas:</h2>
            <ul className="mb-8">
            {lojasFiltradas.map(loja => (
                <li key={loja._id} className="border p-4 mb-2 rounded hover:bg-gray-50 transition">
                <Link
                    to={`/cliente/loja/${loja._id}`}
                    className="text-blue-600 font-bold hover:underline"
                >
                    {loja.nome}
                </Link>
                <p className="text-gray-700">{loja.endereco?.cidade || 'Cidade não informada'}</p>
                </li>
            ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">Ranking de lojas mais avaliadas:</h2>
            <ul>
            {ranking.map(empresa => (
                <li key={empresa._id} className="border p-4 mb-2 rounded bg-gray-50">
                <h3 className="font-bold text-gray-800">{empresa.nome}</h3>
                <p className="text-gray-700">Cidade: {empresa.endereco?.cidade || 'Cidade não informada'}</p>
                <p className="text-gray-700">Prints recebidos: {empresa.printsCount}</p>
                </li>
            ))}
            </ul>
        </main>
        </div>
    );
}