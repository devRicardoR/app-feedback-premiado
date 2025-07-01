import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RotaProtegida({ children, tipo }) {
    const token = localStorage.getItem('token');
    const tipoUsuario = localStorage.getItem('tipo'); // cliente ou empresa

    if (!token || tipoUsuario !== tipo) {
        return <Navigate to={`/${tipo}/login`} />;
    }

    return children;
}