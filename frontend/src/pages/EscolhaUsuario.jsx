import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EscolhaUsuario() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-white">
        {/* Cabeçalho fixo */}
        <header className="bg-[#0a0a23] p-4 text-center font-semibold text-lg text-white shadow">
            Feedback Premiado
        </header>

        {/* Conteúdo centralizado */}
        <main className="flex flex-col items-center justify-center flex-1 gap-8 px-4">
            <h1 className="text-3xl font-bold text-gray-700 mt-10">
            Escolha o tipo de login
            </h1>

            <button
            onClick={() => navigate('/cliente/login')}
            className="w-full max-w-xs px-6 py-3 bg-[#0a0a23] text-white font-semibold rounded shadow hover:bg-blue-900 transition"
            >
            Login Cliente
            </button>

            <button
            onClick={() => navigate('/empresa/login')}
            className="w-full max-w-xs px-6 py-3 bg-[#0a0a23] text-white font-semibold rounded shadow hover:bg-blue-900 transition"
            >
            Login Empresa
            </button>
        </main>
        </div>
    );
}