import React from 'react';
import { Navigate } from 'react-router-dom';
import { setToken } from '../services/api';

export default function RotaProtegida({ children, tipo }) {
    const token = localStorage.getItem('token');
    const tipoUsuario = localStorage.getItem('tipo'); // cliente ou empresa

    if (!token || tipoUsuario !== tipo) {
        return <Navigate to={`/${tipo}/login`} />;
    }

    setToken(token); // seta token no axios para todas requisições

    return children;
}