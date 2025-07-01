import { useNavigate } from 'react-router-dom';

export default function BotaoLogout() {
    const navigate = useNavigate();

    function logout() {
        navigate('/logout');
    }

    return (
        <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
        Sair
        </button>
    );
}