import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EscolhaUsuario() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-3xl font-bold">Escolha o tipo de login</h1>
        <button
            onClick={() => navigate('/cliente/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Login Cliente
        </button>
        <button
            onClick={() => navigate('/empresa/login')}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
            Login Empresa
        </button>
        </div>
    );
}