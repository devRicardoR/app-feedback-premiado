import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api, { setToken } from "../../services/api";

export default function LojaDetalhes() {
    const { id } = useParams();
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
        } catch (err) {
            console.error(err);
            setErro("Erro ao carregar dados da loja");
        }
    }

    async function carregarTarefas() {
        try {
            const response = await api.get(`/tarefas/empresa/${id}`);
            setTarefas(response.data);
        } catch (err) {
            console.error(err);
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
            const response = await api.post(`/prints/enviar`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUploadStatus(`🎉 Parabéns! Você ganhou ${response.data.desconto || ""}% de desconto pelo seu feedback!`);
            setPrintsEnviados((prev) => ({ ...prev, [tarefaId]: true }));
        } catch (error) {
            console.error(error);
            setErro(error.response?.data?.message || "Erro ao enviar comprovante");
        }
    }

    const toggleTarefa = (tarefaId) => {
        setTarefasAbertas((prev) => ({
            ...prev,
            [tarefaId]: !prev[tarefaId],
        }));
    };

    if (!loja) return <p className="p-6">Carregando...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 rounded shadow bg-white">
            {/* Exibir dados principais da loja */}
            <div className="mb-6 flex items-center space-x-4">
                {loja.fachada ? (
                    <img
                        src={`http://localhost:5000/uploads/prints/${loja.fachada}`}
                        alt={`Logo da loja ${loja.nome}`}
                        className="w-24 h-24 object-contain rounded"
                    />
                ) : (
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-500">Sem logo</span>
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{loja.nome}</h1>
                    <p className="text-gray-700"><strong>CNPJ/CPF:</strong> {loja.cnpj_cpf}</p>
                    <p className="text-gray-700"><strong>E-mail:</strong> {loja.email}</p>
                </div>
            </div>

            {/* Endereço completo */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Endereço</h2>
                <p className="text-gray-700">
                    {loja.endereco?.rua}, {loja.endereco?.numero}
                    {loja.endereco?.complemento ? `, ${loja.endereco.complemento}` : ''} <br />
                    {loja.endereco?.bairro} - {loja.endereco?.cidade} / {loja.endereco?.estado} <br />
                    CEP: {loja.endereco?.cep || "Não informado"}
                </p>
            </div>

            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Tarefas</h2>

            {erro && <p className="mb-4 text-red-600">{erro}</p>}
            {uploadStatus && <p className="mb-4 text-green-600">{uploadStatus}</p>}

            <ul className="space-y-6">
                {tarefas.map((tarefa) => (
                    <li key={tarefa._id} className="border p-4 rounded bg-gray-50">
                        <p className="font-bold text-gray-800">{tarefa.titulo || "Tarefa"}</p>
                        {!tarefasAbertas[tarefa._id] ? (
                            <button
                                onClick={() => toggleTarefa(tarefa._id)}
                                className="mt-2 px-4 py-2 bg-[#0a0a23] text-white rounded hover:bg-blue-900 transition"
                            >
                                Realizar Tarefa
                            </button>
                        ) : (
                            <>
                                <p className="text-gray-700">
                                    <strong>Descrição:</strong> {tarefa.descricao}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Link da tarefa:</strong>{" "}
                                    <a href={tarefa.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        {tarefa.link}
                                    </a>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Desconto:</strong> {tarefa.desconto}%
                                </p>
                                {printsEnviados[tarefa._id] ? (
                                    <p className="text-green-700 font-semibold mt-2">Comprovante enviado!</p>
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => enviarPrint(tarefa._id, e.target.files[0])}
                                        className="mt-2"
                                    />
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}