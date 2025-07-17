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

            if (response.data.clientes && response.data.clientes.length > 0) {
                const clientesComDados = await Promise.all(
                    response.data.clientes.map(async (cliente) => {
                        if (cliente.id_cliente) {
                            try {
                                const resCliente = await api.get(`/clientes/${cliente.id_cliente}`);
                                return {
                                    ...cliente,
                                    nome: resCliente.data.nome,
                                    email: resCliente.data.email,
                                };
                            } catch {
                                return cliente;
                            }
                        }
                        return cliente;
                    })
                );
                setClientes(clientesComDados);
            } else {
                setClientes([]);
            }

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

    const renderCarimbos = (carimbosRecebidos) => {
        const total = meta;
        return (
            <div className="grid grid-cols-5 gap-2 mt-2">
                {Array.from({ length: total }).map((_, index) => (
                    <div
                        key={index}
                        className="w-12 h-12 rounded-xl flex items-center justify-center border-2 bg-white/10"
                    >
                        {index < carimbosRecebidos ? (
                            <img
                                src="/dar-carimbo.png"
                                alt="Carimbo"
                                className="w-10 h-10 object-contain"
                            />
                        ) : null}
                    </div>
                ))}
            </div>
        );
    };

    if (erro) {
        return (
            <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow flex items-center justify-center text-white">
                <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg max-w-xl text-center">
                    <h1 className="text-3xl font-bold mb-4 text-[#800020]">🚫 Erro</h1>
                    <p className="text-lg">{erro}</p>
                </div>
            </div>
        );
    }

    if (!empresa) {
        return (
            <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow flex items-center justify-center text-white text-xl">
                Carregando dados da empresa...
            </div>
        );
    }

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow text-white p-6">
            <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl">
                <h1 className="text-4xl font-extrabold text-center mb-6 drop-shadow-lg text-[#800020]">🎯 Painel de Fidelidade</h1>

                <p className="mb-6 text-white/90 text-lg text-center">
                    Crie ou edite seu programa de fidelidade com metas, regras e benefícios. Veja os clientes participantes e gerencie carimbos.
                </p>

                {mensagem && <p className="text-green-300 mb-4 text-center font-semibold">{mensagem}</p>}

                {!programa ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-[#800020]">🆕 Criar Programa de Fidelidade</h2>

                        <label className="block mb-2 font-semibold">📜 Regras</label>
                        <textarea
                            value={regras}
                            onChange={(e) => setRegras(e.target.value)}
                            className="w-full px-4 py-3 text-lg rounded-2xl bg-white/25 text-white placeholder-white/70 backdrop-blur-md mb-4 focus:ring-4 focus:ring-white outline-none"
                            placeholder="Ex: A cada 10 compras, o cliente ganha um brinde"
                        />

                        <label className="block mb-2 font-semibold">🎁 Benefícios</label>
                        <textarea
                            value={beneficios}
                            onChange={(e) => setBeneficios(e.target.value)}
                            className="w-full px-4 py-3 text-lg rounded-2xl bg-white/25 text-white placeholder-white/70 backdrop-blur-md mb-4 focus:ring-4 focus:ring-white outline-none"
                            placeholder="Ex: Brinde, desconto, etc."
                        />

                        <label className="block mb-2 font-semibold">🏁 Meta de Carimbos</label>
                        <input
                            type="number"
                            value={meta}
                            min={1}
                            onChange={(e) => setMeta(Number(e.target.value))}
                            className="w-full px-4 py-3 text-lg rounded-2xl bg-white/25 text-white placeholder-white/70 backdrop-blur-md mb-6 focus:ring-4 focus:ring-white outline-none"
                        />

                        <button
                            onClick={criarPrograma}
                            className="w-full py-3 rounded-full bg-green-600 hover:bg-green-700 transition font-bold text-white shadow-lg"
                        >
                            Criar Programa
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-[#800020]">✏️ Editar Programa de Fidelidade</h2>

                        <label className="block mb-2 font-semibold">📜 Regras</label>
                        <textarea
                            value={regras}
                            onChange={(e) => setRegras(e.target.value)}
                            className="w-full px-4 py-3 text-lg rounded-2xl bg-white/25 text-white placeholder-white/70 backdrop-blur-md mb-4 focus:ring-4 focus:ring-white outline-none"
                        />

                        <label className="block mb-2 font-semibold">🎁 Benefícios</label>
                        <textarea
                            value={beneficios}
                            onChange={(e) => setBeneficios(e.target.value)}
                            className="w-full px-4 py-3 text-lg rounded-2xl bg-white/25 text-white placeholder-white/70 backdrop-blur-md mb-4 focus:ring-4 focus:ring-white outline-none"
                        />

                        <label className="block mb-2 font-semibold">🏁 Meta de Carimbos</label>
                        <input
                            type="number"
                            value={meta}
                            min={1}
                            onChange={(e) => setMeta(Number(e.target.value))}
                            className="w-full px-4 py-3 text-lg rounded-2xl bg-white/25 text-white placeholder-white/70 backdrop-blur-md mb-6 focus:ring-4 focus:ring-white outline-none"
                        />

                        <button
                            onClick={atualizarPrograma}
                            className="w-full py-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition font-bold text-white shadow-lg mb-6"
                        >
                            Atualizar Programa
                        </button>

                        <h3 className="text-xl font-bold mb-4 text-[#800020]">👥 Clientes Participantes</h3>

                        {clientes.length === 0 ? (
                            <p className="text-white/80">Nenhum cliente participa ainda.</p>
                        ) : (
                            <ul className="space-y-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-brandOrange scrollbar-track-transparent">
                                {clientes.map((cliente) => (
                                    <li
                                        key={cliente.id_cliente || cliente._id}
                                        className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/30 shadow-lg"
                                    >
                                        <p className="text-red-900 font-semibold text-lg">
                                            {cliente.nome || "Cliente"}
                                        </p>
                                        <p className="text-red-900 text-base">
                                            Email: {cliente.email || "Não disponível"}
                                        </p>
                                        <div className="mt-2">
                                            <p className="font-semibold text-white mb-1">Carimbos:</p>
                                            {renderCarimbos(cliente.carimbos)}
                                        </div>
                                        <button
                                            onClick={() => darCarimbo(cliente.id_cliente || cliente._id)}
                                            className="mt-4 px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-md transition"
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
        </div>
    );
}