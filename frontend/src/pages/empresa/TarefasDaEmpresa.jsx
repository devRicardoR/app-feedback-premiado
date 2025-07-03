import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function TarefasDaEmpresa() {
    const { id } = useParams(); // ID da empresa
    const [empresa, setEmpresa] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
    const [print, setPrint] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarDados() {
            try {
                const [empresaRes, tarefasRes] = await Promise.all([
                    api.get(`/empresas/${id}`),
                    api.get(`/tarefas/empresa/${id}`)
                ]);
                setEmpresa(empresaRes.data);
                setTarefas(tarefasRes.data);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [id]);

    async function enviarPrint(e) {
        e.preventDefault();

        if (!print || !tarefaSelecionada) return;

        const formData = new FormData();
        formData.append('print', print);

        try {
            await api.post(`/tarefas/${tarefaSelecionada._id}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMensagem(`✅ Você liberou ${tarefaSelecionada.desconto}% de desconto!`);
            setTarefaSelecionada(null);
            setPrint(null);
        } catch (err) {
            console.error('Erro ao enviar print:', err);
            setMensagem('Erro ao enviar print. Tente novamente.');
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
            {/* Header fixo */}
            <header className="bg-[#0a0a23] text-white p-4 text-center font-semibold text-lg shadow-md fixed top-0 w-full z-50">
                Feedback Premiado
            </header>

            {/* Conteúdo principal */}
            <main className="flex-1 mt-20 mb-20 px-4 max-w-3xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-4">
                    Tarefas de {empresa?.nome || 'Empresa'}
                </h1>

                {carregando ? (
                    <p>Carregando...</p>
                ) : tarefas.length === 0 ? (
                    <p>Esta empresa ainda não possui tarefas públicas.</p>
                ) : (
                    <ul className="space-y-4">
                        {tarefas.map((tarefa) => (
                            <li key={tarefa._id} className="border p-4 rounded shadow bg-white">
                                <p className="font-bold text-lg">{tarefa.descricao}</p>
                                <button
                                    onClick={() => {
                                        setTarefaSelecionada(tarefa);
                                        setMensagem('');
                                    }}
                                    className="mt-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                >
                                    Realizar Tarefa
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {tarefaSelecionada && (
                    <div className="mt-6 border p-4 rounded bg-white shadow">
                        <h2 className="text-lg font-semibold mb-2">Link da tarefa:</h2>
                        <a
                            href={tarefaSelecionada.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Acessar tarefa
                        </a>

                        <form onSubmit={enviarPrint} className="mt-4">
                            <label className="block mb-2">
                                Enviar print da tarefa:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPrint(e.target.files[0])}
                                    className="block mt-1"
                                />
                            </label>
                            <button
                                type="submit"
                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Enviar
                            </button>
                        </form>
                    </div>
                )}

                {mensagem && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
                        {mensagem}
                    </div>
                )}
            </main>

            {/* Rodapé fixo */}
            <footer className="bg-[#0a0a23] text-white fixed bottom-0 w-full flex justify-around py-3 border-t z-50">
                <button
                    onClick={() => navigate('/empresa/painel')}
                    className="flex flex-col items-center text-white"
                >
                    <span className="text-xl">🏠</span>
                    <span className="text-xs">Home</span>
                </button>
                <button
                    onClick={() => navigate('/empresa/editar')}
                    className="flex flex-col items-center text-white"
                >
                    <span className="text-xl">👤</span>
                    <span className="text-xs">Editar</span>
                </button>
                <button
                    onClick={() => navigate('/logout')}
                    className="flex flex-col items-center text-white"
                >
                    <span className="text-xl">⬅️</span>
                    <span className="text-xs">Sair</span>
                </button>
            </footer>
        </div>
    );
}