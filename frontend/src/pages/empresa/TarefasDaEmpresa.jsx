import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function TarefasDaEmpresa() {
    const { id } = useParams();
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
        <div className="flex flex-col min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow text-white">
            <header className="bg-white/20 backdrop-blur-md p-4 text-center font-semibold text-lg shadow-md fixed top-0 w-full z-50">
                Feedback Premiado
            </header>

            <main className="flex-1 mt-20 mb-24 px-4 max-w-3xl mx-auto w-full">
                <h1 className="text-3xl font-extrabold mb-6 drop-shadow">
                    Tarefas de {empresa?.nome || 'Empresa'}
                </h1>

                {carregando ? (
                    <p className="text-white/90">Carregando...</p>
                ) : tarefas.length === 0 ? (
                    <p className="text-white/90">Esta empresa ainda não possui tarefas públicas.</p>
                ) : (
                    <ul className="space-y-4">
                        {tarefas.map((tarefa) => (
                            <li key={tarefa._id} className="bg-white/20 backdrop-blur-md p-5 rounded-3xl shadow-lg border border-white/30">
                                <p className="font-bold text-xl">{tarefa.descricao}</p>
                                <button
                                    onClick={() => {
                                        setTarefaSelecionada(tarefa);
                                        setMensagem('');
                                    }}
                                    className="mt-3 px-5 py-2 bg-brandYellow text-white font-semibold rounded-full shadow hover:scale-105 transition-transform"
                                >
                                    Realizar Tarefa
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {tarefaSelecionada && (
                    <div className="mt-6 bg-white/20 backdrop-blur-md p-5 rounded-3xl shadow-lg border border-white/30">
                        <h2 className="text-xl font-bold mb-2">Link da tarefa:</h2>
                        <a
                            href={tarefaSelecionada.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white underline hover:text-yellow-300"
                        >
                            Acessar tarefa
                        </a>

                        <form onSubmit={enviarPrint} className="mt-4">
                            <label className="block mb-3 font-semibold">
                                Enviar print da tarefa:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPrint(e.target.files[0])}
                                    className="block mt-2 text-white file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-brandGreen file:text-white
                                        hover:file:bg-green-600 transition-all animate-pulse"
                                />
                            </label>
                            <button
                                type="submit"
                                className="mt-2 px-5 py-2 bg-brandRed text-white font-bold rounded-full shadow hover:scale-105 transition"
                            >
                                Enviar
                            </button>
                        </form>
                    </div>
                )}

                {mensagem && (
                    <div className="mt-4 p-4 bg-white/20 border border-white/30 text-white font-semibold rounded-3xl backdrop-blur-md shadow">
                        {mensagem}
                    </div>
                )}
            </main>

            <footer className="bg-white/20 backdrop-blur-md fixed bottom-0 w-full flex justify-around py-3 border-t border-white/30 z-50 text-white">
                <button
                    onClick={() => navigate('/empresa/painel')}
                    className="flex flex-col items-center"
                >
                    <span className="text-xl">🏠</span>
                    <span className="text-xs">Home</span>
                </button>
                <button
                    onClick={() => navigate('/empresa/editar')}
                    className="flex flex-col items-center"
                >
                    <span className="text-xl">👤</span>
                    <span className="text-xs">Editar</span>
                </button>
                <button
                    onClick={() => navigate('/logout')}
                    className="flex flex-col items-center"
                >
                    <span className="text-xl">⬅️</span>
                    <span className="text-xs">Sair</span>
                </button>
            </footer>
        </div>
    );
}