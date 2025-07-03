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
        <div className="max-w-xl mx-auto p-4 text-gray-800">
            {/* Foto + Nome */}
            <div className="mb-6 text-center">
                {empresa.fachada && (
                    <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${empresa.fachada}`}
                        alt="Fachada da empresa"
                        className="rounded-lg w-full h-52 object-cover shadow"
                    />
                )}
                <h1 className="text-3xl font-bold mt-4">{empresa.nome}</h1>
            </div>

            {/* Ações principais */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Painel da Empresa</h2>
                {/* REMOVIDO: Botões Editar Perfil e Logout */}
            </div>

            {/* Dados da empresa */}
            <section className="mb-6 bg-white rounded p-4 shadow">
                <h3 className="font-semibold text-lg mb-2">Dados</h3>
                <p><strong>CNPJ/CPF:</strong> {empresa.cnpj_cpf}</p>
                <p><strong>Email:</strong> {empresa.email}</p>
                <p><strong>Endereço:</strong> {empresa.endereco?.rua}, {empresa.endereco?.numero} - {empresa.endereco?.cidade}</p>
            </section>

            {/* Criar tarefa */}
            <section className="mb-6 bg-white rounded p-4 shadow">
                <h3 className="font-semibold text-lg mb-2">Nova Tarefa</h3>
                {erro && <p className="text-red-500">{erro}</p>}
                {mensagem && <p className="text-green-600">{mensagem}</p>}
                <form onSubmit={criarTarefa} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={novaTarefa.descricao}
                        onChange={e => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="url"
                        placeholder="Link"
                        value={novaTarefa.link}
                        onChange={e => setNovaTarefa({ ...novaTarefa, link: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Desconto (%)"
                        value={novaTarefa.desconto}
                        onChange={e => setNovaTarefa({ ...novaTarefa, desconto: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        min="1"
                        max="100"
                        required
                    />
                    <button className="w-full bg-[#0a0a23] text-white py-2 rounded hover:bg-[#14142e] transition">
                        Criar
                    </button>
                </form>
            </section>

            {/* Lista de tarefas */}
            <section className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Minhas Tarefas</h3>
                {tarefas.length === 0 ? (
                    <p className="text-gray-500">Nenhuma tarefa cadastrada.</p>
                ) : (
                    <ul className="space-y-3">
                        {tarefas.map(tarefa => (
                            <li key={tarefa._id} className="bg-white rounded p-4 shadow">
                                {editandoTarefaId === tarefa._id ? (
                                    <form onSubmit={salvarEdicao} className="space-y-2">
                                        <input
                                            type="text"
                                            value={tarefaEditada.descricao}
                                            onChange={e => setTarefaEditada({ ...tarefaEditada, descricao: e.target.value })}
                                            className="w-full px-3 py-2 border rounded"
                                        />
                                        <input
                                            type="url"
                                            value={tarefaEditada.link}
                                            onChange={e => setTarefaEditada({ ...tarefaEditada, link: e.target.value })}
                                            className="w-full px-3 py-2 border rounded"
                                        />
                                        <input
                                            type="number"
                                            value={tarefaEditada.desconto}
                                            onChange={e => setTarefaEditada({ ...tarefaEditada, desconto: e.target.value })}
                                            className="w-full px-3 py-2 border rounded"
                                            min="1"
                                            max="100"
                                        />
                                        <div className="flex gap-2">
                                            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">
                                                Salvar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelarEdicao}
                                                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                                        <p>
                                            <strong>Link:</strong>{' '}
                                            <a href={tarefa.link} className="text-[#0a0a23] font-semibold hover:underline" target="_blank" rel="noreferrer">
                                                {tarefa.link}
                                            </a>
                                        </p>
                                        <p><strong>Desconto:</strong> {tarefa.desconto}%</p>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => iniciarEdicao(tarefa)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => excluirTarefa(tarefa._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Lista de prints */}
            <section className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Prints Recebidos</h3>
                {prints.length === 0 ? (
                    <p className="text-gray-500">Nenhum print recebido ainda.</p>
                ) : (
                    <ul className="space-y-3">
                        {prints.map(print => (
                            <li key={print._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
                                <img
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${print.imagem}`}
                                    alt="Print"
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <p className="text-sm text-gray-600">{new Date(print.data_upload).toLocaleString()}</p>
                                <button
                                    onClick={() => excluirPrint(print._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Link para ranking */}
            <div className="text-center mt-8">
                <a
                    href="/empresa/ranking"
                    className="bg-[#0a0a23] text-white px-6 py-2 rounded hover:bg-[#14142e] transition inline-block"
                >
                    Ver Ranking Geral
                </a>
            </div>
        </div>
    );
}