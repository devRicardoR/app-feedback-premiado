import React, { useEffect, useState } from "react";
import api, { setToken } from "../../services/api";

export default function ProgramaFidelizacaoPainel() {
    const [empresa, setEmpresa] = useState(null);
    const [programa, setPrograma] = useState(null);
    const [regras, setRegras] = useState("");
    const [beneficios, setBeneficios] = useState("");
    const [meta, setMeta] = useState(10);
    const [clientes, setClientes] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function init() {
            const token = localStorage.getItem("token");
            if (!token) {
                setErro("Usuário não autenticado.");
                return;
            }

            setToken(token);

            try {
                const resEmpresa = await api.get("/empresas/me");
                if (!resEmpresa.data?._id) {
                    setErro("Erro ao carregar dados da empresa");
                    return;
                }
                setEmpresa(resEmpresa.data);
                await carregarPrograma(resEmpresa.data._id);
            } catch (err) {
                console.error(err);
                setErro("Erro ao carregar empresa");
            }
        }

        init();
    }, []);

    async function carregarPrograma(id_empresa) {
        try {
            const response = await api.get(`/fidelidade/${id_empresa}`);
            setPrograma(response.data);
            setRegras(response.data.regras || "");
            setBeneficios(response.data.beneficios || "");
            setMeta(response.data.meta || 10);
            setClientes(response.data.clientes || []);
            setErro("");
            setMensagem("");
        } catch (err) {
            if (err.response?.status === 404) {
                setPrograma(null);
                setRegras("");
                setBeneficios("");
                setMeta(10);
                setClientes([]);
                setErro("");
                setMensagem("");
            } else {
                setErro("Erro ao carregar programa");
            }
        }
    }

    async function criarPrograma() {
        setErro("");
        setMensagem("");
        if (!empresa?._id) {
            setErro("Empresa não carregada");
            return;
        }
        try {
            const response = await api.post("/fidelidade", {
                regras,
                beneficios,
                meta,
            });
            setMensagem("Programa criado com sucesso!");
            setPrograma(response.data);
            await carregarPrograma(empresa._id);
        } catch (err) {
            console.error(err);
            setErro("Erro ao criar programa");
        }
    }

    async function atualizarPrograma() {
        setErro("");
        setMensagem("");
        if (!empresa?._id) {
            setErro("Empresa não carregada");
            return;
        }
        try {
            const response = await api.put("/fidelidade", {
                regras,
                beneficios,
                meta,
            });
            setMensagem("Programa atualizado com sucesso!");
            setPrograma(response.data);
        } catch (err) {
            console.error(err);
            setErro("Erro ao atualizar programa");
        }
    }

    async function darCarimbo(id_cliente) {
        setErro("");
        setMensagem("");
        if (!empresa?._id) {
            setErro("Empresa não carregada");
            return;
        }
        try {
            await api.post("/fidelidade/carimbar", {
                id_empresa: empresa._id,
                id_cliente,
            });
            setMensagem("Carimbo adicionado!");
            await carregarPrograma(empresa._id);
        } catch (err) {
            console.error(err);
            setErro("Erro ao adicionar carimbo");
        }
    }

    if (erro) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow text-red-600">
                <h1 className="text-2xl font-bold mb-4 text-center">Erro</h1>
                <p>{erro}</p>
            </div>
        );
    }

    if (!empresa) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow text-gray-600 text-center">
                Carregando dados da empresa...
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
                🎯 Painel de Fidelidade
            </h1>

            <p className="mb-6 text-gray-700">
                Aqui você pode criar um programa de fidelidade. Especifique o que seu cliente precisa cumprir para ganhar carimbos, as regras do programa, e quais benefícios ele receberá ao completar a meta.
            </p>

            {mensagem && <p className="text-green-600 mb-4">{mensagem}</p>}

            {!programa ? (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Criar Programa de Fidelidade</h2>

                    <label className="block mb-1 font-semibold">Regras para o cliente cumprir</label>
                    <textarea
                        placeholder="Ex: A cada 10 cortes de cabelo, o cliente ganha um brinde"
                        value={regras}
                        onChange={(e) => setRegras(e.target.value)}
                        className="border px-3 py-2 rounded w-full mb-3"
                    />

                    <label className="block mb-1 font-semibold">Benefícios que o cliente receberá</label>
                    <textarea
                        placeholder="Descreva o brinde ou benefício que será liberado"
                        value={beneficios}
                        onChange={(e) => setBeneficios(e.target.value)}
                        className="border px-3 py-2 rounded w-full mb-3"
                    />

                    <label className="block mb-1 font-semibold">Quantidade de carimbos para completar a meta</label>
                    <input
                        type="number"
                        min={1}
                        value={meta}
                        onChange={(e) => setMeta(Number(e.target.value))}
                        className="border px-3 py-2 rounded w-full mb-4"
                    />

                    <button
                        onClick={criarPrograma}
                        className="bg-[#0a0a23] text-white px-4 py-2 rounded hover:bg-[#14142e]"
                    >
                        Criar Programa
                    </button>
                </div>
            ) : (
                <>
                    <h2 className="text-lg font-semibold mb-2">Editar Programa de Fidelidade</h2>

                    <label className="block mb-1 font-semibold">Regras para o cliente cumprir</label>
                    <textarea
                        placeholder="Ex: A cada 10 cortes de cabelo, o cliente ganha um brinde"
                        value={regras}
                        onChange={(e) => setRegras(e.target.value)}
                        className="border px-3 py-2 rounded w-full mb-3"
                    />

                    <label className="block mb-1 font-semibold">Benefícios que o cliente receberá</label>
                    <textarea
                        placeholder="Descreva o brinde ou benefício que será liberado"
                        value={beneficios}
                        onChange={(e) => setBeneficios(e.target.value)}
                        className="border px-3 py-2 rounded w-full mb-3"
                    />

                    <label className="block mb-1 font-semibold">Quantidade de carimbos para completar a meta</label>
                    <input
                        type="number"
                        min={1}
                        value={meta}
                        onChange={(e) => setMeta(Number(e.target.value))}
                        className="border px-3 py-2 rounded w-full mb-4"
                    />

                    <button
                        onClick={atualizarPrograma}
                        className="bg-[#0a0a23] text-white px-4 py-2 rounded hover:bg-[#14142e]"
                    >
                        Atualizar Programa
                    </button>

                    <p className="mb-4 mt-6 text-gray-700 font-semibold">Clientes Participantes:</p>

                    {clientes.length === 0 ? (
                        <p className="text-gray-500">Nenhum cliente iniciou o programa ainda.</p>
                    ) : (
                        <ul className="space-y-3">
                            {clientes.map((cliente) => (
                                <li
                                    key={cliente.id_cliente || cliente._id}
                                    className="border p-4 rounded bg-gray-50"
                                >
                                    <p className="text-gray-800 font-semibold">
                                        {cliente.nome || "Cliente"}
                                    </p>
                                    <p className="text-gray-600">Email: {cliente.email || "Não disponível"}</p>
                                    <p className="text-gray-600">Carimbos: {cliente.carimbos}</p>
                                    <button
                                        onClick={() => darCarimbo(cliente.id_cliente || cliente._id)}
                                        className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                    >
                                        Dar Carimbo
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}