import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api, { setToken } from '../../services/api';

export default function LojaDetalhes() {
    console.log('LojaDetalhes renderizado');
    const { id } = useParams(); // id da loja
    const [loja, setLoja] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [printsEnviados, setPrintsEnviados] = useState({});
    const [tarefasAbertas, setTarefasAbertas] = useState({});
    const [uploadStatus, setUploadStatus] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setToken(token);

        // Só chama as funções depois que o token está setado
        carregarLoja();
        carregarTarefas();
    }, [id]);

    async function carregarLoja() {
        try {
            const response = await api.get(`/empresas/${id}`);
            setLoja(response.data);
        } catch (err) {
            console.error(err);
            setErro('Erro ao carregar dados da loja');
        }
    }

    async function carregarTarefas() {
        try {
            const response = await api.get(`/tarefas/empresa/${id}`);
            setTarefas(response.data);
        } catch (err) {
            console.error(err);
            setErro('Erro ao carregar tarefas');
        }
    }

    async function enviarPrint(tarefaId, file) {
        if (!file) return;
        setUploadStatus('');
        setErro('');

        const formData = new FormData();
        // ALTERAÇÃO: o backend espera que o arquivo venha no campo 'print'
        formData.append('print', file);
        formData.append('id_tarefa', tarefaId);
        formData.append('id_empresa', id);

        try {
            const response = await api.post(`/tarefas/${tarefaId}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadStatus(`🎉 Parabéns! Você ganhou ${response.data.desconto || ''}% de desconto pelo seu feedback!`);
            setPrintsEnviados((prev) => ({ ...prev, [tarefaId]: true }));
        } catch (error) {
            console.error(error);
            setErro(error.response?.data?.message || 'Erro ao enviar comprovante');
        }
    }

    const toggleTarefa = (tarefaId) => {
        console.log('clicou no botão para tarefa:', tarefaId);
        setTarefasAbertas(prev => ({
            ...prev,
            [tarefaId]: !prev[tarefaId]
        }));
    };

    if (!loja) return <p className="p-6">Carregando...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
            <h1 className="text-3xl font-bold mb-4">{loja.nome}</h1>
            <p><strong>Endereço:</strong> {loja.endereco?.rua}, {loja.endereco?.numero}, {loja.endereco?.cidade}</p>
            <p><strong>E-mail:</strong> {loja.email}</p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">Tarefas</h2>
            {erro && <p className="mb-4 text-red-600">{erro}</p>}
            {uploadStatus && <p className="mb-4 text-green-600">{uploadStatus}</p>}

            <ul className="space-y-6">
                {tarefas.map((tarefa) => (
                    <li key={tarefa._id} className="border p-4 rounded">
                        <p className="font-bold">{tarefa.titulo || 'Tarefa'}</p>
                        {!tarefasAbertas[tarefa._id] ? (
                            <button
                                onClick={() => toggleTarefa(tarefa._id)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Realizar Tarefa
                            </button>
                        ) : (
                            <>
                                <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                                <p>
                                    <strong>Link da tarefa:</strong>{' '}
                                    <a href={tarefa.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        {tarefa.link}
                                    </a>
                                </p>
                                <p><strong>Desconto:</strong> {tarefa.desconto}%</p>
                                {printsEnviados[tarefa._id] ? (
                                    <p className="text-green-700 font-semibold mt-2">Comprovante enviado!</p>
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => enviarPrint(tarefa._id, e.target.files[0])}
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