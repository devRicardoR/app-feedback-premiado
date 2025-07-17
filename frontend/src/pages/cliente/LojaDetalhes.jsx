import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { setToken } from "../../services/api";

export default function LojaDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loja, setLoja] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [printsEnviados, setPrintsEnviados] = useState({});
    const [tarefasAbertas, setTarefasAbertas] = useState({});
    const [uploadStatus, setUploadStatus] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        setToken(token);
        carregarLoja();
        carregarTarefas();
    }, [id]);

    async function carregarLoja() {
        try {
            const response = await api.get(`/empresas/${id}`);
            setLoja(response.data);
        } catch {
            setErro("Erro ao carregar dados da loja");
        }
    }

    async function carregarTarefas() {
        try {
            const response = await api.get(`/tarefas/empresa/${id}`);
            setTarefas(response.data);
        } catch {
            setErro("Erro ao carregar tarefas");
        }
    }

    async function enviarPrint(tarefaId, file) {
        if (!file) return;
        setUploadStatus("");
        setErro("");
        const formData = new FormData();
        formData.append("imagem", file);
        formData.append("id_tarefa", tarefaId);
        formData.append("id_empresa", id);
        try {
            const { data } = await api.post(`/prints/enviar`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploadStatus(`🎉 Parabéns! Você ganhou ${data.desconto || ""}% de desconto pelo seu feedback!`);
            setPrintsEnviados((prev) => ({ ...prev, [tarefaId]: true }));
        } catch (error) {
            setErro(error.response?.data?.message || "Erro ao enviar comprovante");
        }
    }

    const toggleTarefa = (tarefaId) =>
        setTarefasAbertas((prev) => ({ ...prev, [tarefaId]: !prev[tarefaId] }));

    const irParaProgramaFidelidade = () => navigate(`/cliente/fidelidade/${id}`);

    if (!loja) return <p className="p-6 text-white">Carregando...</p>;

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow text-white p-6">
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg mb-8 flex items-center gap-6">
                {loja.fachada ? (
                    <img
                        src={`http://localhost:5000/uploads/prints/${loja.fachada}`}
                        alt={`Logo da loja ${loja.nome}`}
                        className="w-24 h-24 object-contain rounded-2xl shadow-md"
                    />
                ) : (
                    <div className="w-24 h-24 bg-white/30 text-white/70 flex items-center justify-center rounded-2xl shadow-inner">
                        Sem logo
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-extrabold uppercase text-[#5B1B29] drop-shadow">{loja.nome}</h1>
                    <p className="text-white/90"><strong>CNPJ/CPF:</strong> {loja.cnpj_cpf}</p>
                    <p className="text-white/90"><strong>E-mail:</strong> {loja.email}</p>
                </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold uppercase text-[#5B1B29] mb-2">Endereço</h2>
                <p className="text-white/90">
                    {loja.endereco?.rua}, {loja.endereco?.numero}
                    {loja.endereco?.complemento ? `, ${loja.endereco.complemento}` : ""} <br />
                    {loja.endereco?.bairro} - {loja.endereco?.cidade} / {loja.endereco?.estado} <br />
                    CEP: {loja.endereco?.cep || "Não informado"}
                </p>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg mb-8 border border-white/30">
                <h2 className="text-2xl font-bold uppercase text-[#5B1B29] mb-2">Programa de Fidelidade</h2>
                <p className="text-white/90 mb-3">
                    Participe do programa de fidelidade desta loja e ganhe descontos, brindes e vantagens exclusivas!
                </p>
                <button
                    onClick={irParaProgramaFidelidade}
                    className="bg-brandGreen hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full uppercase tracking-wide transition shadow-lg focus:outline-none focus:ring-4 focus:ring-[#5B1B29]"
                >
                    Quero Participar 🎉
                </button>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/30">
                <h2 className="text-2xl font-bold uppercase text-[#5B1B29] mb-4">Tarefas</h2>

                {erro && <p className="mb-4 text-red-300 font-semibold">{erro}</p>}
                {uploadStatus && (
                    <div className="animate-pulse bg-green-500/80 text-white text-center font-bold text-lg py-3 rounded-2xl mb-6 shadow-lg ring-4 ring-white/30">
                        {uploadStatus}
                    </div>
                )}

                <ul className="space-y-6">
                    {tarefas.map((tarefa) => (
                        <li key={tarefa._id} className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 shadow">
                            <p className="font-bold text-lg text-white mb-2 uppercase">{tarefa.titulo || "Tarefa"}</p>
                            {!tarefasAbertas[tarefa._id] ? (
                                <button
                                    onClick={() => toggleTarefa(tarefa._id)}
                                    className="px-4 py-2 bg-brandGreen text-white font-semibold rounded-full uppercase tracking-wide hover:bg-green-600 transition focus:outline-none focus:ring-4 focus:ring-[#5B1B29]"
                                >
                                    Realizar Tarefa
                                </button>
                            ) : (
                                <>
                                    <p className="text-white/90 mb-2"><strong>Descrição:</strong> {tarefa.descricao}</p>
                                    <a
                                        href={tarefa.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mb-3 px-4 py-2 rounded-full bg-brandGreen text-white font-semibold uppercase tracking-wide hover:bg-green-600 transition focus:outline-none focus:ring-4 focus:ring-[#5B1B29]"
                                    >
                                        Acessar Tarefa
                                    </a>
                                    <p className="text-lg font-bold text-white mb-2">
                                        🎯 Desconto:{" "}
                                        <span className="text-3xl text-red-900 animate-pulse font-extrabold">
                                            {tarefa.desconto}%
                                        </span>
                                    </p>
                                    {printsEnviados[tarefa._id] ? (
                                        <div className="animate-pulse bg-green-600/90 text-white text-center font-semibold py-2 rounded-xl mt-2 shadow ring-2 ring-white/40">
                                            ✅ Comprovante enviado!
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                id={`file-${tarefa._id}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => enviarPrint(tarefa._id, e.target.files[0])}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor={`file-${tarefa._id}`}
                                                className="inline-block mt-2 px-4 py-2 rounded-full bg-brandGreen text-white font-semibold uppercase tracking-wide cursor-pointer hover:bg-green-600 transition focus:outline-none focus:ring-4 focus:ring-[#5B1B29]"
                                            >
                                                Enviar Comprovante
                                            </label>
                                        </>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}