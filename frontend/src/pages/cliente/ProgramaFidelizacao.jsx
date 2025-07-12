import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { setToken } from '../../services/api';

export default function ProgramaFidelizacao() {
    const { id_empresa } = useParams();
    const navigate = useNavigate();

    const [programa, setPrograma] = useState(null);
    const [carimbos, setCarimbos] = useState(0);
    const [regras, setRegras] = useState('');
    const [beneficios, setBeneficios] = useState('');
    const [meta, setMeta] = useState(0);
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(true);
    const [participando, setParticipando] = useState(false);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setErro('Você precisa estar logado para acessar.');
            setLoading(false);
            navigate('/cliente/login');
            return;
        }
        setToken(token);

        async function carregarPrograma() {
            try {
                const response = await api.get(`/fidelidade/progresso/${id_empresa}`);
                const data = response.data;

                setPrograma(data);
                setRegras(data.regras);
                setBeneficios(data.beneficios);
                setMeta(data.meta);
                setCarimbos(data.carimbos);
                setParticipando(true);
                setMensagem('');
                setErro('');
            } catch (error) {
                if (error.response?.status === 401) {
                    setErro('Sessão expirada. Faça login novamente.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('tipo');
                    navigate('/cliente/login');
                } else if (error.response?.status === 404) {
                    // Programa existe mas cliente não participa ainda
                    setParticipando(false);
                    setMensagem('');
                    setErro('');
                } else {
                    setErro('Erro ao carregar programa de fidelidade.');
                }
            } finally {
                setLoading(false);
            }
        }

        carregarPrograma();
    }, [id_empresa, navigate]);

    async function participarPrograma() {
        setMensagem('');
        setErro('');

        try {
            await api.post(`/fidelidade/participar/${id_empresa}`);
            setParticipando(true);
            setCarimbos(0);
            setMensagem('Cadastro realizado com sucesso!');
        } catch (error) {
            if (error.response?.status === 400) {
                setMensagem('Você já está participando do programa!');
            } else {
                setErro('Erro ao participar do programa.');
            }
        }
    }

    if (loading) return <div className="max-w-xl mx-auto p-4">Carregando programa de fidelidade...</div>;
    if (erro) return <div className="max-w-xl mx-auto p-4 text-red-600 font-semibold">{erro}</div>;
    if (!programa && !participando) return <div className="max-w-xl mx-auto p-4">Nenhum programa de fidelidade encontrado.</div>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Programa de Fidelidade</h1>
            {programa && (
                <>
                    <p className="mb-2"><strong>Regras:</strong> {regras}</p>
                    <p className="mb-2"><strong>Benefícios:</strong> {beneficios}</p>
                    <p className="mb-2"><strong>Meta de carimbos:</strong> {meta}</p>
                    <p className="mb-4"><strong>Seus carimbos:</strong> {carimbos}</p>
                </>
            )}

            <button
                onClick={participarPrograma}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Participar
            </button>

            {mensagem && <p className="mt-4 text-green-600 font-semibold">{mensagem}</p>}
        </div>
    );
}