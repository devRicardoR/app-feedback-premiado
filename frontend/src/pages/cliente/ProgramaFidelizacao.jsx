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

    const renderCarimbos = (carimbos, meta) => {
        return (
            <div className="grid grid-cols-5 gap-5 mt-4">
                {Array.from({ length: meta }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-20 h-20 rounded-xl flex items-center justify-center transition
                        ${
                            index < carimbos
                                ? 'bg-white/80 text-black shadow-xl'
                                : 'bg-white/20 text-white/30 border border-white/30'
                        }`}
                    >
                        {index < carimbos && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="none" />
                                <path d="M7 12l3 3 7-7" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (loading)
        return <div className="text-white p-6 text-xl">Carregando programa de fidelidade...</div>;

    if (erro)
        return <div className="text-red-300 p-6 font-semibold text-xl">{erro}</div>;

    if (!programa && !participando)
        return <div className="text-white p-6 text-xl">Nenhum programa de fidelidade encontrado.</div>;

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow text-white p-6 flex justify-center items-start">
            <div className="w-full max-w-3xl bg-white/20 backdrop-blur-md rounded-3xl shadow-lg border border-white/30 p-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold uppercase text-[#5B1B29] drop-shadow">🎉 Programa de Fidelidade</h1>
                    <p className="text-white/90 mt-4 text-2xl">Ganhe carimbos e desbloqueie recompensas exclusivas!</p>
                </div>

                {programa && (
                    <>
                        <div className="mb-6">
                            <p className="text-2xl font-bold uppercase text-[#5B1B29] mb-2">📜 Regras:</p>
                            <p className="text-white/90 text-lg">{regras}</p>
                        </div>

                        <div className="mb-6">
                            <p className="text-2xl font-bold uppercase text-[#5B1B29] mb-2">🎁 Benefícios:</p>
                            <p className="text-white/90 text-lg">{beneficios}</p>
                        </div>

                        <div className="mb-6">
                            <p className="text-2xl font-bold uppercase text-[#5B1B29] mb-2">🎯 Meta de Carimbos:</p>
                            <p className="text-white/90 text-lg">{meta}</p>
                        </div>

                        <div className="mb-8">
                            <p className="text-2xl font-bold uppercase text-[#5B1B29] mb-2">🔘 Seus Carimbos:</p>
                            {renderCarimbos(carimbos, meta)}
                        </div>
                    </>
                )}

                {!participando && (
                    <div className="text-center">
                        <button
                            onClick={participarPrograma}
                            className="bg-brandGreen hover:bg-green-600 text-white text-lg font-semibold px-8 py-3 rounded-full uppercase tracking-wide transition focus:outline-none focus:ring-4 focus:ring-[#5B1B29]"
                        >
                            Participar do Programa
                        </button>
                    </div>
                )}

                {mensagem && (
                    <div className="mt-8 text-center animate-pulse bg-green-500/90 text-white text-xl font-bold py-4 rounded-2xl shadow ring-2 ring-white/30">
                        {mensagem}
                    </div>
                )}
            </div>
        </div>
    );
}