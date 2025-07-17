import React, { useState, useEffect } from 'react';
import api, { setToken } from '../../services/api';

export default function EmpresaPainel() {
    const [empresa, setEmpresa] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [prints, setPrints] = useState([]);
    const [novaTarefa, setNovaTarefa] = useState({ descricao: '', link: '', desconto: '' });
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [editandoTarefaId, setEditandoTarefaId] = useState(null);
    const [tarefaEditada, setTarefaEditada] = useState({ descricao: '', link: '', desconto: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setToken(token);
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const resEmpresa = await api.get('/empresas/me');
            setEmpresa(resEmpresa.data);

            const resTarefas = await api.get('/tarefas/minhas');
            setTarefas(resTarefas.data);

            const resPrints = await api.get(`/prints/empresa/${resEmpresa.data._id}`);
            setPrints(resPrints.data);
        } catch (e) {
            console.error(e);
            setErro('Erro ao carregar dados');
        }
    }

    async function criarTarefa(e) {
        e.preventDefault();
        setErro('');
        setMensagem('');
        try {
            const res = await api.post('/tarefas', {
                ...novaTarefa,
                desconto: Number(novaTarefa.desconto),
            });
            setMensagem('Tarefa criada com sucesso!');
            setNovaTarefa({ descricao: '', link: '', desconto: '' });
            setTarefas([...tarefas, res.data]);
        } catch (e) {
            console.error(e);
            setErro('Erro ao criar tarefa');
        }
    }

    function iniciarEdicao(tarefa) {
        setEditandoTarefaId(tarefa._id);
        setTarefaEditada({
            descricao: tarefa.descricao,
            link: tarefa.link,
            desconto: tarefa.desconto,
        });
        setMensagem('');
        setErro('');
    }

    function cancelarEdicao() {
        setEditandoTarefaId(null);
        setTarefaEditada({ descricao: '', link: '', desconto: '' });
    }

    async function salvarEdicao(e) {
        e.preventDefault();
        setErro('');
        setMensagem('');
        try {
            const res = await api.put(`/tarefas/${editandoTarefaId}`, {
                ...tarefaEditada,
                desconto: Number(tarefaEditada.desconto),
            });
            setMensagem('Tarefa editada com sucesso!');
            setTarefas(tarefas.map(t => (t._id === editandoTarefaId ? res.data : t)));
            cancelarEdicao();
        } catch (e) {
            console.error(e);
            setErro('Erro ao editar tarefa');
        }
    }

    async function excluirTarefa(id) {
        if (!window.confirm('Tem certeza que quer excluir esta tarefa?')) return;
        try {
            await api.delete(`/tarefas/${id}`);
            setTarefas(tarefas.filter(t => t._id !== id));
            setMensagem('Tarefa excluída com sucesso!');
        } catch (e) {
            console.error(e);
            setErro('Erro ao excluir tarefa');
        }
    }

    async function excluirPrint(id) {
        if (!window.confirm('Confirma exclusão do print?')) return;
        try {
            await api.delete(`/prints/${id}`);
            setPrints(prints.filter(p => p._id !== id));
        } catch (e) {
            console.error(e);
            setErro('Erro ao excluir print');
        }
    }

    if (!empresa) return <p className="p-6">Carregando...</p>;

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow text-white p-6">
            {/* IMAGEM DA FACHADA - corrigida */}
            <div className="mb-8 text-center">
                {empresa.fachada && (
                    <div className="w-full max-h-[208px] overflow-hidden rounded-3xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20">
                        <img
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${empresa.fachada}`}
                            alt="Fachada da empresa"
                            className="w-full h-52 object-cover rounded-3xl"
                        />
                    </div>
                )}
                <h1 className="text-4xl font-extrabold mt-4 drop-shadow-lg">{empresa.nome}</h1>
            </div>

            <section className="mb-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">📋 Dados da Empresa</h3>
                <p><strong>CNPJ/CPF:</strong> {empresa.cnpj_cpf}</p>
                <p><strong>Email:</strong> {empresa.email}</p>
                <p><strong>Endereço:</strong> {empresa.endereco?.rua}, {empresa.endereco?.numero} - {empresa.endereco?.cidade}</p>
            </section>

            <section className="mb-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">🆕 Nova Tarefa</h3>
                {erro && <p className="text-red-400">{erro}</p>}
                {mensagem && <p className="text-green-300">{mensagem}</p>}
                <form onSubmit={criarTarefa} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={novaTarefa.descricao}
                        onChange={e => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                        className="w-full px-4 py-2 rounded-2xl bg-white/25 text-white placeholder-white/80 backdrop-blur-md outline-none focus:ring-4 focus:ring-white"
                        required
                    />
                    <input
                        type="url"
                        placeholder="Link"
                        value={novaTarefa.link}
                        onChange={e => setNovaTarefa({ ...novaTarefa, link: e.target.value })}
                        className="w-full px-4 py-2 rounded-2xl bg-white/25 text-white placeholder-white/80 backdrop-blur-md outline-none focus:ring-4 focus:ring-white"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Desconto (%)"
                        value={novaTarefa.desconto}
                        onChange={e => setNovaTarefa({ ...novaTarefa, desconto: e.target.value })}
                        className="w-full px-4 py-2 rounded-2xl bg-white/25 text-white placeholder-white/80 backdrop-blur-md outline-none focus:ring-4 focus:ring-white"
                        min="1"
                        max="100"
                        required
                    />
                    <button className="w-full bg-brandGreen hover:bg-green-600 transition text-white font-semibold py-2 rounded-full shadow-lg animate-pulse">
                        Criar
                    </button>
                </form>
            </section>

            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">✅ Minhas Tarefas</h3>
                {tarefas.length === 0 ? (
                    <p className="text-white/70">Nenhuma tarefa cadastrada.</p>
                ) : (
                    <ul className="space-y-4">
                        {tarefas.map(tarefa => (
                            <li key={tarefa._id} className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-5 shadow-lg flex justify-between items-start">
                                <div className="flex-1 pr-4">
                                    {editandoTarefaId === tarefa._id ? (
                                        <form onSubmit={salvarEdicao} className="space-y-3">
                                            <input
                                                type="text"
                                                value={tarefaEditada.descricao}
                                                onChange={e => setTarefaEditada({ ...tarefaEditada, descricao: e.target.value })}
                                                className="w-full px-4 py-2 rounded-2xl bg-white/25 text-white placeholder-white/80 backdrop-blur-md outline-none focus:ring-4 focus:ring-white"
                                            />
                                            <input
                                                type="url"
                                                value={tarefaEditada.link}
                                                onChange={e => setTarefaEditada({ ...tarefaEditada, link: e.target.value })}
                                                className="w-full px-4 py-2 rounded-2xl bg-white/25 text-white placeholder-white/80 backdrop-blur-md outline-none focus:ring-4 focus:ring-white"
                                            />
                                            <input
                                                type="number"
                                                value={tarefaEditada.desconto}
                                                onChange={e => setTarefaEditada({ ...tarefaEditada, desconto: e.target.value })}
                                                className="w-full px-4 py-2 rounded-2xl bg-white/25 text-white placeholder-white/80 backdrop-blur-md outline-none focus:ring-4 focus:ring-white"
                                                min="1"
                                                max="100"
                                            />
                                            <div className="flex gap-3">
                                                <button className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition text-sm">Salvar</button>
                                                <button type="button" onClick={cancelarEdicao} className="bg-gray-500 text-white px-3 py-1 rounded shadow hover:bg-gray-600 transition text-sm">Cancelar</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                                            <p><strong>Link:</strong></p>
                                            <a
                                                href={tarefa.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block mt-1 bg-brandGreen hover:bg-green-600 transition text-white font-semibold px-3 py-1 rounded shadow text-sm"
                                            >
                                                Acessar Link
                                            </a>
                                            <p className="mt-2"><strong>Desconto:</strong> {tarefa.desconto}%</p>
                                        </>
                                    )}
                                </div>
                                {editandoTarefaId !== tarefa._id && (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => iniciarEdicao(tarefa)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => excluirTarefa(tarefa._id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700 transition text-sm"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="mb-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">🎯 Programa de Fidelidade</h3>
                <p className="text-white/80 mb-4">
                    Engaje seus clientes oferecendo recompensas ao completar ações.
                </p>
                <a
                    href="/empresa/fidelidade"
                    className="inline-block bg-brandGreen hover:bg-green-600 transition text-white px-6 py-3 rounded-full font-semibold shadow-lg animate-pulse"
                >
                    Criar ou Gerenciar Programa
                </a>
            </section>

            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">🖼️ Prints Recebidos</h3>
                {prints.length === 0 ? (
                    <p className="text-white/70">Nenhum print recebido ainda.</p>
                ) : (
                    <ul className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-brandOrange scrollbar-track-transparent">
                        {prints.map(print => (
                            <li key={print._id} className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-5 shadow-lg flex gap-4 items-center">
                                <img
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${print.imagem}`}
                                    alt="Print"
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <p className="text-white/90 text-sm">
                                        <strong>Cliente:</strong> {print.id_cliente?.nome || 'Desconhecido'} ({print.id_cliente?.email || 'sem e-mail'})
                                    </p>
                                    <p className="text-white/70 text-sm">
                                        <strong>Enviado em:</strong> {new Date(print.data_upload).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => excluirPrint(print._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded-full shadow hover:bg-red-700 transition text-sm"
                                >
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <div className="text-center mt-10">
                <a
                    href="/empresa/ranking"
                    className="bg-brandGreen hover:bg-green-600 transition text-white px-8 py-3 rounded-full font-semibold shadow-lg animate-pulse"
                >
                    Ver Ranking Geral
                </a>
            </div>
        </div>
    );
}