import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const tipo = localStorage.getItem('tipo');
        localStorage.removeItem('token');
        localStorage.removeItem('tipo');

        if (tipo === 'empresa') {
        navigate('/empresa/login');
        } else {
        navigate('/cliente/login');
        }
    }, [navigate]);

    return null;
}