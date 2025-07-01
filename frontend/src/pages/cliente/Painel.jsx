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

    const lojasFiltradas = lojas.filter(loja => {
        return (
            loja.nome?.toLowerCase().includes(busca.toLowerCase()) &&
            (filtroCidade === '' || loja.endereco?.cidade?.toLowerCase() === filtroCidade.toLowerCase())
        );
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Painel do Cliente</h1>
                <BotaoLogout />
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar loja por nome"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    className="border px-3 py-2 rounded w-full max-w-md"
                />
            </div>

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Filtrar por cidade"
                    value={filtroCidade}
                    onChange={e => setFiltroCidade(e.target.value)}
                    className="border px-3 py-2 rounded w-full max-w-md"
                />
            </div>

            <h2 className="text-xl font-semibold mb-4">Lojas filtradas:</h2>
            <ul className="mb-8">
                {lojasFiltradas.map(loja => (
                    <li key={loja._id} className="border p-4 mb-2 rounded hover:bg-gray-50 transition">
                        <Link
                            to={`/empresa/${loja._id}/tarefas`}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            {loja.nome}
                        </Link>
                        <p>{loja.endereco?.cidade || 'Cidade não informada'}</p>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4">Ranking de lojas mais avaliadas:</h2>
            <ul>
                {ranking.map(empresa => (
                    <li key={empresa._id} className="border p-4 mb-2 rounded">
                        <h3 className="font-bold">{empresa.nome}</h3>
                        <p>Cidade: {empresa.endereco?.cidade || 'Cidade não informada'}</p>
                        <p>Prints recebidos: {empresa.printsCount}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}