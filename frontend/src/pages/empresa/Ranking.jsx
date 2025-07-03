import React, { useEffect, useState } from "react";
import api, { setToken } from "../../services/api";

export default function EmpresaRanking() {
    const [ranking, setRanking] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        setErro("Usuário não autenticado");
        return;
        }
        setToken(token);
        carregarRanking();
    }, []);

    async function carregarRanking() {
        try {
        const res = await api.get("/empresas/ranking");
        setRanking(res.data);
        } catch (e) {
        console.error(e);
        setErro("Erro ao carregar ranking");
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Ranking de Empresas Mais Avaliadas
        </h1>

        {erro && <p className="text-red-600 mb-4 text-center">{erro}</p>}

        {ranking.length === 0 ? (
            <p className="text-center text-gray-600">
            Nenhuma avaliação encontrada.
            </p>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300 rounded">
                <thead className="bg-[#0a0a23] text-white">
                <tr>
                    <th className="px-4 py-2 border border-gray-300">Posição</th>
                    <th className="px-4 py-2 border border-gray-300">
                    Nome da Empresa
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Cidade</th>
                    <th className="px-4 py-2 border border-gray-300">
                    Total de Prints
                    </th>
                </tr>
                </thead>
                <tbody>
                {ranking.map((empresa, idx) => (
                    <tr
                    key={empresa.empresaId}
                    className="text-center hover:bg-gray-100"
                    >
                    <td className="px-4 py-2 border border-gray-300">
                        {idx + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                        {empresa.nome}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                        {empresa.cidade}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                        {empresa.totalPrints}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
}
