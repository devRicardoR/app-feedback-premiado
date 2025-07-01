import React, { useEffect, useState } from 'react';
import api, { setToken } from '../../services/api';

export default function EmpresaRanking() {
    const [ranking, setRanking] = useState([]);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
        setErro('Usuário não autenticado');
        return;
        }
        setToken(token);
        carregarRanking();
    }, []);

    async function carregarRanking() {
        try {
        const res = await api.get('/empresas/ranking');
        setRanking(res.data);
        } catch (e) {
        console.error(e);
        setErro('Erro ao carregar ranking');
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
        <h1 className="text-3xl font-bold mb-6">Ranking de Empresas Mais Avaliadas</h1>
        {erro && <p className="text-red-600 mb-4">{erro}</p>}
        {ranking.length === 0 ? (
            <p>Nenhuma avaliação encontrada.</p>
        ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Posição</th>
                <th className="border border-gray-300 px-4 py-2">Nome da Empresa</th>
                <th className="border border-gray-300 px-4 py-2">Cidade</th>
                <th className="border border-gray-300 px-4 py-2">Total de Prints</th>
                </tr>
            </thead>
            <tbody>
                {ranking.map((empresa, idx) => (
                <tr key={empresa.empresaId} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{empresa.nome}</td>
                    <td className="border border-gray-300 px-4 py-2">{empresa.cidade}</td>
                    <td className="border border-gray-300 px-4 py-2">{empresa.totalPrints}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
    );
}