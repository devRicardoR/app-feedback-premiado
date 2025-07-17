import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EscolhaUsuario() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen font-poppins bg-gradient-to-br from-brandRed via-brandOrange to-brandYellow flex flex-col">
            {/* Cabeçalho fixo */}
            <header className="bg-[#504b4d] p-4 text-center font-extrabold text-lg text-white shadow-lg">
                Feedback Premiado
            </header>

            {/* Conteúdo centralizado */}
            <main className="flex flex-col items-center justify-center flex-1 gap-10 px-6">
                <h1 className="text-4xl font-extrabold text-white uppercase tracking-wide drop-shadow-lg mt-12">
                    Escolha o tipo de login
                </h1>

                <button
                    onClick={() => navigate('/cliente/login')}
                    className="w-full max-w-xs px-8 py-4 bg-brandGreen hover:bg-green-600 text-white font-extrabold rounded-3xl shadow-lg transition focus:ring-4 focus:ring-white"
                >
                    Login Cliente
                </button>

                <button
                    onClick={() => navigate('/empresa/login')}
                    className="w-full max-w-xs px-8 py-4 bg-brandGreen hover:bg-green-600 text-white font-extrabold rounded-3xl shadow-lg transition focus:ring-4 focus:ring-white"
                >
                    Login Empresa
                </button>
            </main>
        </div>
    );
}