import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { setToken } from '../../services/api';
import BotaoLogout from '../../components/BotaoLogout';

export default function EmpresaPainel() {
    const [empresa, setEmpresa] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [prints, setPrints] = useState([]);
    const [novaTarefa, setNovaTarefa] = useState({ descricao: '', link: '', desconto: '' });
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [editandoTarefaId, setEditandoTarefaId] = useState(null);
    const [tarefaEditada, setTarefaEditada] = useState({ descricao: '', link: '', desconto: '' });

    const navigate = useNavigate();

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

    function irParaEditarPerfil() {
        navigate('/empresa/editar');
    }

    if (!empresa) return <p className="p-6">Carregando...</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-6">
            {/* FOTO DA FACHADA + NOME DA EMPRESA EM DESTAQUE */}
            <div className="flex flex-col items-center mb-8">
                {empresa.fachada && (
                    <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${empresa.fachada}`}
                        alt="Fachada da empresa"
                        className="w-full max-w-4xl h-64 object-cover rounded"
                        style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                )}
                <h1 className="text-5xl font-extrabold mt-6 text-center">{empresa.nome}</h1>
            </div>

            {/* Título menor Painel da Empresa + Botões */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Painel da Empresa</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={irParaEditarPerfil}
                        className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition"
                    >
                        Editar Perfil
                    </button>
                    <BotaoLogout />
                </div>
            </div>

            {/* Dados da Empresa */}
            <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Dados da Empresa</h3>
                <p><strong>CNPJ/CPF:</strong> {empresa.cnpj_cpf}</p>
                <p><strong>E-mail:</strong> {empresa.email}</p>
                <p><strong>Endereço:</strong> {empresa.endereco?.rua}, {empresa.endereco?.numero}, {empresa.endereco?.cidade}</p>
            </section>

            {/* Criar Tarefa */}
            <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Criar Tarefa</h3>
                {erro && <p className="text-red-600 mb-2">{erro}</p>}
                {mensagem && <p className="text-green-600 mb-2">{mensagem}</p>}
                <form onSubmit={criarTarefa} className="space-y-3 max-w-md">
                    <input
                        type="text"
                        placeholder="Descrição da tarefa"
                        value={novaTarefa.descricao}
                        onChange={e => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="url"
                        placeholder="Link da tarefa"
                        value={novaTarefa.link}
                        onChange={e => setNovaTarefa({ ...novaTarefa, link: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Valor do desconto (%)"
                        value={novaTarefa.desconto}
                        onChange={e => setNovaTarefa({ ...novaTarefa, desconto: e.target.value })}
                        min="1"
                        max="100"
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Criar tarefa
                    </button>
                </form>
            </section>

            {/* Minhas Tarefas */}
            <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Minhas Tarefas</h3>
                {tarefas.length === 0 && <p>Você não possui tarefas cadastradas.</p>}
                <ul className="space-y-4 max-w-lg">
                    {tarefas.map(tarefa => (
                        <li key={tarefa._id} className="border p-3 rounded flex justify-between items-center">
                            {editandoTarefaId === tarefa._id ? (
                                <form onSubmit={salvarEdicao} className="flex flex-col space-y-2 w-full max-w-md">
                                    <input
                                        type="text"
                                        value={tarefaEditada.descricao}
                                        onChange={e => setTarefaEditada({ ...tarefaEditada, descricao: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                    <input
                                        type="url"
                                        value={tarefaEditada.link}
                                        onChange={e => setTarefaEditada({ ...tarefaEditada, link: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        value={tarefaEditada.desconto}
                                        onChange={e => setTarefaEditada({ ...tarefaEditada, desconto: e.target.value })}
                                        min="1"
                                        max="100"
                                        required
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelarEdicao}
                                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div>
                                        <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                                        <p><strong>Link:</strong> <a href={tarefa.link} target="_blank" rel="noopener noreferrer">{tarefa.link}</a></p>
                                        <p><strong>Desconto:</strong> {tarefa.desconto}%</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                                            onClick={() => iniciarEdicao(tarefa)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            onClick={() => excluirTarefa(tarefa._id)}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Prints Recebidos */}
            <section className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">Prints Recebidos</h3>
                {prints.length === 0 && <p>Nenhum print recebido ainda.</p>}
                <ul className="space-y-4 max-w-lg">
                    {prints.map(print => (
                        <li key={print._id} className="border p-3 rounded flex items-center justify-between">
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/prints/${print.imagem}`}
                                alt="Print"
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div>
                                <p>Data: {new Date(print.data_upload).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => excluirPrint(print._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Excluir
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <div className="mt-6">
                <Link
                    to="/empresa/ranking"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    Ver Ranking Geral de Empresas
                </Link>
            </div>
        </div>
    );
}