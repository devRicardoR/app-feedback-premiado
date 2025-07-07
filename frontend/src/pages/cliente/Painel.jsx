import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import BotaoLogout from '../../components/BotaoLogout';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    });

    export default function ClientePainel() {
    const [lojas, setLojas] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [busca, setBusca] = useState('');
    const [filtroCidade, setFiltroCidade] = useState('');
    const [localizacao, setLocalizacao] = useState([-25.4284, -49.2733]);

    useEffect(() => {
        async function carregarDados() {
        try {
            const [resLojas, resRanking] = await Promise.all([
            api.get('/empresas'),
            api.get('/empresas/ranking'),
            ]);
            setLojas(resLojas.data);
            setRanking(resRanking.data);
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
        }
        }

        carregarDados();

        navigator.geolocation.getCurrentPosition(
        (pos) => {
            setLocalizacao([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
            console.warn('Erro ao obter localização:', err);
        }
        );
    }, []);

    const lojasFiltradas = lojas.filter(loja =>
        loja.nome?.toLowerCase().includes(busca.toLowerCase()) &&
        (filtroCidade === '' || loja.endereco?.cidade?.toLowerCase() === filtroCidade.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-white">
        <header className="p-4 flex justify-between items-center bg-[#0a0a23] text-white">
            <h1 className="text-xl font-bold">Painel do Cliente</h1>
            <BotaoLogout />
        </header>

        <div className="p-4 bg-white shadow-md z-10">
            <div className="flex gap-4 mb-4">
            <input
                type="text"
                placeholder="Buscar loja por nome"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
                type="text"
                placeholder="Filtrar por cidade"
                value={filtroCidade}
                onChange={e => setFiltroCidade(e.target.value)}
                className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            </div>

            {lojasFiltradas.length > 0 && (
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Lojas encontradas:</h2>
                <div className="max-h-40 overflow-y-auto border rounded">
                {lojasFiltradas.map(loja => (
                    <div key={loja._id} className="p-2 border-b hover:bg-gray-50">
                    <Link
                        to={`/cliente/loja/${loja._id}`}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        {loja.nome}
                    </Link>
                    <p className="text-sm text-gray-600">
                        {loja.endereco?.rua}, {loja.endereco?.numero} - {loja.endereco?.cidade || 'Cidade não informada'}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>

        <div className="h-[400px] relative z-0">
            <MapContainer
            center={localizacao}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
            >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {lojasFiltradas.map(loja => (
                loja.endereco?.localizacao?.coordinates && (
                <Marker
                    key={loja._id}
                    position={[
                    loja.endereco.localizacao.coordinates[1],
                    loja.endereco.localizacao.coordinates[0],
                    ]}
                >
                    <Popup>
                    <strong>{loja.nome}</strong><br />
                    {loja.endereco?.rua}, {loja.endereco?.numero}<br />
                    {loja.endereco?.cidade}
                    <br />
                    <Link
                        to={`/cliente/loja/${loja._id}`}
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        Ver detalhes
                    </Link>
                    </Popup>
                </Marker>
                )
            ))}
            </MapContainer>
        </div>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ranking de empresas mais avaliadas</h2>
            <ul className="space-y-3">
            {ranking.map((empresa, index) => (
                <li key={empresa.empresaId} className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex justify-between items-start">
                    <div>
                    <h3 className="font-bold text-gray-800">
                        {index + 1}. {empresa.nome}
                    </h3>
                    <p className="text-gray-600">
                        {empresa.cidade || 'Cidade não informada'}
                    </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {empresa.totalPrints} prints
                    </span>
                </div>
                </li>
            ))}
            </ul>
        </main>
        </div>
    );
}