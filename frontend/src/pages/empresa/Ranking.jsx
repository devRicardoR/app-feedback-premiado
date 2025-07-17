import React, { useEffect, useState } from "react";
import api, { setToken } from "../../services/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    } from "recharts";

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

    const maiorPontuacao = Math.max(...ranking.map((e) => e.totalPrints), 1);

    return (
        <main className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-6xl w-full bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-lg">
            <h1 className="text-4xl font-extrabold mb-8 drop-shadow-md text-white text-center">
            Ranking de Empresas Mais Avaliadas
            </h1>

            {erro && (
            <p className="mb-6 text-red-500 text-center font-semibold">{erro}</p>
            )}

            {ranking.length === 0 ? (
            <p className="text-center text-white/90 text-lg">
                Nenhuma avaliação encontrada.
            </p>
            ) : (
            <div className="w-full h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={ranking}
                    margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255 255 255 / 0.2)"
                    />
                    <XAxis
                    dataKey="nome"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: "white", fontWeight: "600", fontSize: 12 }}
                    />
                    <YAxis
                    tick={{ fill: "white", fontWeight: "600" }}
                    domain={[0, Math.ceil(maiorPontuacao * 1.1)]}
                    />
                    <Tooltip
                    contentStyle={{
                        backgroundColor: "#1f2937",
                        borderRadius: "8px",
                        border: "none",
                    }}
                    itemStyle={{ color: "#F87171", fontWeight: "600" }}
                    />
                    <Bar
                    dataKey="totalPrints"
                    fill="#7B1A1A"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={60}
                    />
                </BarChart>
                </ResponsiveContainer>
            </div>
            )}
        </div>
        </main>
    );
}
